import md5 from 'md5';
import { Asset, Entry, UnresolvedLink } from 'contentful/dist/types/types';
import {
  ComponentPropertyValue,
  DesignValue,
  ExperienceComponentSettings,
  ExperienceComponentTree,
  ExperienceDataSource,
  ExperienceUnboundValues,
  PrimitiveValue,
} from '@contentful/experiences-validators';
import {
  buildCfStyles,
  checkIsAssemblyNode,
  isValidBreakpointValue,
  parseCSSValue,
  getTargetValueInPixels,
  mergeDesignValuesByBreakpoint,
} from '@/utils';
import { builtInStyles, optionalBuiltInStyles } from '@/definitions';
import { designTokensRegistry } from '@/registries';
import {
  ComponentTreeNode,
  DesignTokensDefinition,
  Experience,
  StyleProps,
  BackgroundImageOptions,
} from '@/types';
import { CF_STYLE_ATTRIBUTES, SUPPORTED_IMAGE_FORMATS } from '@/constants';
import { stringifyCssProperties } from './stylesUtils';
import { getOptimizedBackgroundImageAsset } from '../transformers/media/getOptimizedBackgroundImageAsset';
import { AssetDetails, AssetFile } from 'contentful';

type FlattenedDesignTokens = Record<
  string,
  string | { width?: string; style?: string; color?: string }
>;

export const detachExperienceStyles = (experience: Experience): string | undefined => {
  const experienceTreeRoot = experience.entityStore?.experienceEntryFields
    ?.componentTree as ExperienceComponentTree;

  if (!experienceTreeRoot) {
    return;
  }

  const mapOfDesignVariableKeys = flattenDesignTokenRegistry(designTokensRegistry);

  // getting breakpoints from the entry componentTree field
  const { breakpoints } = experienceTreeRoot;

  // creating the structure which I thought would work best for aggregation
  const mediaQueryDataByBreakpoint = breakpoints.reduce(
    (mediaQueryTemplate, breakpoint) => ({
      ...mediaQueryTemplate,
      [breakpoint.id]: {
        condition: breakpoint.query,
        cssByClassName: {} as Record<string, string>,
      },
    }),
    {} as Record<string, MediaQueryData>,
  );

  // getting the breakpoint ids
  const breakpointIds = Object.keys(mediaQueryDataByBreakpoint);

  const iterateOverTreeAndExtractStyles = ({
    componentTree,
    dataSource,
    unboundValues,
    componentSettings,
    componentVariablesOverwrites,
    patternWrapper,
    wrappingPatternIds,
    wrappingPatternNodeIds = [],
  }: {
    componentTree: ExperienceComponentTree;
    dataSource: ExperienceDataSource;
    unboundValues: ExperienceUnboundValues;
    componentSettings?: ExperienceComponentSettings;
    componentVariablesOverwrites?: Record<string, ComponentPropertyValue>;
    patternWrapper?: ComponentTreeNode;
    wrappingPatternIds: Set<string>;
    wrappingPatternNodeIds?: string[];
  }) => {
    // traversing the tree
    const queue: ComponentTreeNode[] = [];

    queue.push(...componentTree.children);

    // for each tree node
    while (queue.length) {
      const currentNode = queue.shift();
      if (!currentNode) {
        break;
      }

      const usedComponents = experience.entityStore?.usedComponents ?? [];

      const isPatternNode = checkIsAssemblyNode({
        componentId: currentNode.definitionId,
        usedComponents,
      });

      if (isPatternNode) {
        // When detecting a circular dependency among patterns, stop to avoid an infinite loop
        if (wrappingPatternIds.has(currentNode.definitionId)) {
          continue;
        }

        const patternEntry = usedComponents.find(
          (component) => component.sys.id === currentNode!.definitionId,
        );

        if (!patternEntry || !('fields' in patternEntry)) {
          continue;
        }

        const nextComponentVariablesOverwrites = resolveComponentVariablesOverwrites({
          patternNode: currentNode,
          wrapperComponentVariablesOverwrites: componentVariablesOverwrites,
          wrapperComponentSettings: componentSettings,
        });

        // the node of a used pattern contains only the definitionId (id of the patter entry)
        // as well as the variables overwrites
        // the layout of a pattern is stored in it's entry
        iterateOverTreeAndExtractStyles({
          // that is why we pass it here to iterate of the pattern tree
          componentTree: patternEntry.fields.componentTree,
          // but we pass the data source of the experience entry cause that's where the binding is stored
          dataSource,
          // unbound values of a pattern store the default values of pattern variables
          unboundValues: patternEntry.fields.unboundValues,
          // this is where we can map the pattern variable to it's default value
          componentSettings: patternEntry.fields.componentSettings,
          // and this is where the over-writes for the default values are stored
          // yes, I know, it's a bit confusing
          componentVariablesOverwrites: nextComponentVariablesOverwrites,
          // pass top-level pattern node to store instance-specific child styles for rendering
          patternWrapper: currentNode,
          wrappingPatternIds: new Set([...wrappingPatternIds, currentNode.definitionId]),
          wrappingPatternNodeIds: [...wrappingPatternNodeIds, currentNode.id || ''],
        });
        continue;
      }

      /* [Data format] `currentNode.variables` uses the following serialized shape:
       * {
       *   cfMargin: { type: 'DesignValue', valuesByBreakpoint: { desktop: '1px', tablet: '2px' } },
       *   cfPadding: { type: 'DesignValue', valuesByBreakpoint: { desktop: '3px' } }
       *   cfBackgroundImageUrl: { type: 'BoundValue', path: '/lUERH7tX7nJTaPX6f0udB/fields/assetReference/~locale/fields/file/~locale' }
       *   asdf1234: { type: 'ComponentValue', key: 'qwer567' }
       *   // ...
       * }
       */

      // so first, I convert it into a map to help me make it easier to access the values
      const propsByBreakpoint = indexByBreakpoint({
        variables: currentNode.variables,
        breakpointIds,
        unboundValues: unboundValues,
        dataSource: dataSource,
        componentSettings,
        componentVariablesOverwrites,
        getBoundEntityById: (id: string) => {
          return experience.entityStore?.entities.find(
            (entity: Entry | Asset) => entity.sys.id === id,
          );
        },
      });

      /* [Data format] `propsByBreakpoint` is a map of "breakpointId > propertyName > plainValue":
       * {
       *   desktop: {
       *     cfMargin: '1px',
       *     cfWidth: 'fill',
       *     cfBackgroundImageUrl: 'https://example.com/image.jpg'
       *     //...
       *   }
       * }
       */

      const currentNodeClassNames: string[] = [];
      // Chain IDs to avoid overwriting styles across multiple instances of the same pattern
      // e.g. `{outerPatternNodeId}{innerPatternNodeId}-{currentNodeId}`
      // (!) Notice that the chain of patterns (before the dash) follows the format of prebinding/ patternProperties
      const currentNodeIdsChain = `${wrappingPatternNodeIds.join('')}-${currentNode.id}`;

      // For each breakpoint, resolve design tokens, create the CSS and generate a unique className.
      for (const breakpointId of breakpointIds) {
        const propsByBreakpointWithResolvedDesignTokens = Object.entries(
          propsByBreakpoint[breakpointId],
        ).reduce((acc, [variableName, variableValue]) => {
          return {
            ...acc,
            [variableName]: maybePopulateDesignTokenValue(
              variableName,
              variableValue,
              mapOfDesignVariableKeys,
            ),
          };
        }, {});

        // Convert CF-specific property names to CSS variables, e.g. `cfMargin` -> `margin`
        const cfStyles = buildCfStyles(propsByBreakpointWithResolvedDesignTokens);

        /* [Data format] `cfStyles` is a list of CSSProperties (React format):
         * {
         *   margin: '1px',
         *   width: '100%',
         *   backgroundImage: 'url(https://example.com/image.jpg)'
         *   //...
         * }
         */
        const generatedCss = stringifyCssProperties(cfStyles);

        /* [Data format] `generatedCss` is the minimized CSS string that will be added to the DOM:
         * generatedCss = "margin: 1px;width: 100%;..."
         */

        // - Adding breakpointId to ensure not using the same IDs between breakpoints as this leads to
        // conflicts between different breakpoint values from multiple nodes where the hash would be equal
        // - Adding wrapping pattern nodes IDs to avoid conflicts between similar nested patterns as those
        // could override each others CSS for some breakpoints just through the order of `<style>` tags in the DOM.
        const styleHash = md5(currentNodeIdsChain + breakpointId + generatedCss);

        // and prefix the className to make sure the value can be processed
        const className = `cf-${styleHash}`;

        // I save the generated hashes into an array to later save it in the tree node
        // as cfSsrClassName prop
        // making sure to avoid the duplicates in case styles for > 1 breakpoints are the same
        if (!currentNodeClassNames.includes(className)) {
          currentNodeClassNames.push(className);
        }

        // if there is already the similar hash - no need to over-write it
        if (mediaQueryDataByBreakpoint[breakpointId].cssByClassName[className]) {
          continue;
        }

        // otherwise, save it to the stylesheet
        mediaQueryDataByBreakpoint[breakpointId].cssByClassName[className] = generatedCss;
      }

      // all generated classNames are saved in the tree node
      // to be handled by the sdk later
      // each node will get N classNames, where N is the number of breakpoints
      // browsers process classNames in the order they are defined
      // meaning that in case of className1 className2 className3
      // className3 will win over className2 and className1
      // making sure that we respect the order of breakpoints from
      // we can achieve "desktop first" or "mobile first" approach to style over-writes
      if (patternWrapper) {
        // @ts-expect-error -- valueByBreakpoint is not explicitly defined, but it's already defined in the patternWrapper styles
        patternWrapper.variables.cfSsrClassName = {
          ...(patternWrapper.variables.cfSsrClassName ?? {}),
          type: 'DesignValue',
          [currentNodeIdsChain]: {
            valuesByBreakpoint: {
              [breakpointIds[0]]: currentNodeClassNames.join(' '),
            },
          },
        };
      } else {
        currentNode.variables.cfSsrClassName = {
          type: 'DesignValue',
          valuesByBreakpoint: {
            [breakpointIds[0]]: currentNodeClassNames.join(' '),
          },
        };
      }

      queue.push(...currentNode.children);
    }
  };

  iterateOverTreeAndExtractStyles({
    componentTree: experienceTreeRoot,
    dataSource: experience.entityStore?.dataSource ?? {},
    unboundValues: experience.entityStore?.unboundValues ?? {},
    componentSettings: experience.entityStore?.experienceEntryFields?.componentSettings,
    wrappingPatternIds: new Set(
      experience.entityStore?.experienceEntryId ? [experience.entityStore.experienceEntryId] : [],
    ),
  });

  // once the whole tree was traversed, for each breakpoint, I aggregate the styles
  // for each generated className into one css string
  const stylesheet = Object.entries(mediaQueryDataByBreakpoint).reduce(
    (acc, [, mediaQueryData]) => `${acc}${toMediaQuery(mediaQueryData)}`,
    '',
  );

  return stylesheet;
};

/**
 * Rendering pattern nodes inside pattern entry by injecting default values from the top:
 * When there is a ComponentValue but the recursive logic is not wrapped by a pattern node (no `componentVariablesOverwrites`),
 * a pattern entry is rendered directly. In this case, we replace each ComponentValue with the default value from componentSettings.
 */
const injectDefaultValuesForComponentValues = ({
  patternNode,
  wrapperComponentSettings,
}: {
  patternNode: ComponentTreeNode;
  wrapperComponentSettings?: ExperienceComponentSettings;
}): Record<string, ComponentPropertyValue> => {
  const propertyDefinitions = wrapperComponentSettings?.variableDefinitions;
  const resolvedProperties = Object.entries(patternNode.variables).reduce(
    (resolvedProperties, [propertyName, propertyValue]) => {
      if (propertyValue.type === 'ComponentValue') {
        const componentValueKey = propertyValue.key;
        const componentDefaultValue = propertyDefinitions?.[componentValueKey].defaultValue;
        // We're only considering design properties for styles generation
        if ((componentDefaultValue as DesignValue)?.type === 'DesignValue') {
          resolvedProperties[propertyName] = componentDefaultValue;
        }
      } else {
        // Do nothing when it's not a ComponentValue & just keep the defined value
        resolvedProperties[propertyName] = propertyValue;
      }
      return resolvedProperties;
    },
    {},
  );
  return resolvedProperties;
};

/**
 * In case of nested patterns, we need to resolve the ComponentValue properties and overwrite them with the value
 * stored in the parent component.
 *
 *
 * @param patternNode - pattern node which contains the variables
 * @param componentVariablesOverwrites - object which contains the variables of the parent component
 */
const resolveComponentVariablesOverwrites = ({
  patternNode,
  wrapperComponentVariablesOverwrites,
  wrapperComponentSettings,
}: {
  patternNode: ComponentTreeNode;
  wrapperComponentVariablesOverwrites?: Record<string, ComponentPropertyValue>;
  wrapperComponentSettings?: ExperienceComponentSettings;
}): Record<string, ComponentPropertyValue> => {
  // In case of rendering a pattern entry, there are no custom ComponentValues.
  // So we pass down the default values from this pattern node down to each deeper pattern level.
  if (!wrapperComponentVariablesOverwrites) {
    const nextComponentVariablesOverwrites = injectDefaultValuesForComponentValues({
      patternNode,
      wrapperComponentSettings,
    });
    return nextComponentVariablesOverwrites;
  }

  // Rendering (nested) pattern node inside another pattern node (for both experience & pattern entry):
  // The `wrapperComponentVariablesOverwrites` from the top-most pattern node is passed through to each child
  // node (and nested pattern nodes). It replaces each ComponentValue in the subtree with either the overwrite
  // or the default value.
  const nextComponentVariablesOverwrites = Object.entries(patternNode?.variables).reduce(
    (resolvedValues, [propertyName, propertyValue]) => {
      if (propertyValue.type === 'ComponentValue') {
        // Copying the values from the parent node
        const overwritingValue = wrapperComponentVariablesOverwrites?.[propertyValue.key];
        // Property definition from the parent pattern
        const propertyDefinition =
          wrapperComponentSettings?.variableDefinitions?.[propertyValue.key];
        const defaultValue = propertyDefinition?.defaultValue as ComponentPropertyValue | undefined;
        // The overwriting value is either a custom value from the experience or default value from a
        // wrapping pattern node that got trickled down to this nesting level.
        resolvedValues[propertyName] = mergeDefaultAndOverwriteValues(
          defaultValue,
          overwritingValue,
        );
      } else {
        // Keep raw values
        resolvedValues[propertyName] = propertyValue;
      }
      return resolvedValues;
    },
    {},
  );
  return nextComponentVariablesOverwrites;
};

export const isCfStyleAttribute = (variableName: string): variableName is keyof StyleProps => {
  return CF_STYLE_ATTRIBUTES.includes(variableName);
};

export const maybePopulateDesignTokenValue = (
  variableName: string,
  variableValue: unknown,
  mapOfDesignVariableKeys: FlattenedDesignTokens,
) => {
  // TODO: refactor to reuse fn from core package
  if (typeof variableValue !== 'string') {
    return variableValue;
  }

  if (!isCfStyleAttribute(variableName)) {
    return variableValue;
  }

  const resolveSimpleDesignToken = (variableName: keyof StyleProps, variableValue: string) => {
    const nonTemplateDesignTokenValue = variableValue.replace(templateStringRegex, '$1');
    const tokenValue = mapOfDesignVariableKeys[nonTemplateDesignTokenValue];

    if (!tokenValue) {
      if (builtInStyles[variableName]) {
        return builtInStyles[variableName]!.defaultValue;
      }
      if (optionalBuiltInStyles[variableName]) {
        return optionalBuiltInStyles[variableName]!.defaultValue;
      }

      return '0px';
    }

    if (variableName === 'cfBorder' || variableName.startsWith('cfBorder_')) {
      if (typeof tokenValue === 'object') {
        const { width, style, color } = tokenValue;
        return `${width} ${style} ${color}`;
      }
    }

    return tokenValue;
  };

  const templateStringRegex = /\${(.+?)}/g;

  const parts = variableValue.split(' ');

  let resolvedValue = '';
  for (const part of parts) {
    const tokenValue = templateStringRegex.test(part)
      ? resolveSimpleDesignToken(variableName, part)
      : part;
    resolvedValue += `${tokenValue} `;
  }
  // Not trimming would end up with a trailing space that breaks the check in `calculateNodeDefaultHeight`
  return resolvedValue.trim();
};

const transformMedia = (boundAsset: Asset, width?: string, options?: BackgroundImageOptions) => {
  try {
    const asset = boundAsset as Asset;
    // Target width (px/rem/em) will be applied to the css url if it's lower than the original image width (in px)
    const assetDetails = asset.fields.file?.details as AssetDetails;

    const assetWidth = assetDetails?.image?.width || 0; // This is always in px
    if (!options) {
      return asset.fields.file?.url as string;
    }
    const targetWidthObject = parseCSSValue(options.targetSize); // Contains value and unit (px/rem/em) so convert and then compare to assetWidth
    const targetValue = targetWidthObject ? getTargetValueInPixels(targetWidthObject) : assetWidth;

    if (targetValue < assetWidth) width = `${targetValue}px`;
    const value = getOptimizedBackgroundImageAsset(
      asset.fields.file as AssetFile,
      width as string,
      options.quality,
      options.format as (typeof SUPPORTED_IMAGE_FORMATS)[number],
    );
    return value;
  } catch (error) {
    console.error('Error transforming image asset', error);
  }
  return boundAsset.fields.file?.url as string;
};

export const resolveBackgroundImageBinding = ({
  variableData,
  getBoundEntityById,
  dataSource = {},
  unboundValues = {},
  componentVariablesOverwrites,
  componentSettings = { variableDefinitions: {} },
  options,
  width,
}: {
  variableData: ComponentPropertyValue;
  getBoundEntityById: (id: string) => Entry | Asset | undefined;
  unboundValues?: ExperienceUnboundValues;
  dataSource?: ExperienceDataSource;
  componentSettings?: ExperienceComponentSettings;
  // patternNode.variables - a place which contains bindings scoped to the pattern
  componentVariablesOverwrites?: Record<string, ComponentPropertyValue>;
  options?: BackgroundImageOptions;
  width?: string;
}) => {
  if (variableData.type === 'UnboundValue') {
    const uuid = variableData.key;
    return unboundValues[uuid]?.value as string;
  }

  if (variableData.type === 'ComponentValue') {
    const variableDefinitionKey = variableData.key;
    const variableDefinition = componentSettings.variableDefinitions[variableDefinitionKey];

    // @ts-expect-error TODO: Types coming from validations erroneously assume that `defaultValue` can be a primitive value (e.g. string or number)
    const defaultValueKey = variableDefinition.defaultValue?.key;
    const defaultValue = unboundValues[defaultValueKey].value;
    const overwriteValue = componentVariablesOverwrites?.[variableDefinitionKey];

    // overwriteValue is a ComponentValue we can safely return the default value
    if (!overwriteValue || overwriteValue.type === 'ComponentValue') {
      return defaultValue as string | undefined;
    }

    // at this point overwriteValue will either be type of 'DesignValue' or 'BoundValue'
    // so we recursively run resolution again to resolve it
    const resolvedValue = resolveBackgroundImageBinding({
      variableData: overwriteValue,
      getBoundEntityById,
      dataSource,
      unboundValues,
      componentVariablesOverwrites,
      componentSettings,
      options,
      width,
    });

    return resolvedValue || (defaultValue as string | undefined);
  }

  if (variableData.type === 'BoundValue') {
    // '/lUERH7tX7nJTaPX6f0udB/fields/assetReference/~locale/fields/file/~locale'
    const [, uuid] = variableData.path.split('/');
    const binding = dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;
    const boundEntity = getBoundEntityById(binding.sys.id);

    if (!boundEntity) {
      return;
    }

    if (boundEntity.sys.type === 'Asset') {
      return transformMedia(boundEntity as Asset, width, options);
    } else {
      // '/lUERH7tX7nJTaPX6f0udB/fields/assetReference/~locale/fields/file/~locale'
      // becomes
      // '/fields/assetReference/~locale/fields/file/~locale'
      const pathWithoutUUID = variableData.path.split(uuid)[1];
      // '/fields/assetReference/~locale/fields/file/~locale'
      // becomes
      // '/fields/assetReference/'
      const pathToReferencedAsset: string = pathWithoutUUID.split('~locale')[0];
      // '/fields/assetReference/'
      // becomes
      // '[fields, assetReference]'
      const [, fieldName] = pathToReferencedAsset.substring(1).split('/') ?? undefined;

      const referenceToAsset = (boundEntity as Entry).fields[fieldName] as
        | UnresolvedLink<'Asset'>
        | undefined;

      if (!referenceToAsset) {
        return;
      }

      if (referenceToAsset.sys?.linkType === 'Asset') {
        const referencedAsset = getBoundEntityById(referenceToAsset.sys.id) as Asset | undefined;
        if (!referencedAsset) {
          return;
        }

        return transformMedia(referencedAsset as Asset, width, options);
      }
    }
  }
};

const resolveVariable = ({
  variableData,
  defaultBreakpoint,
  componentSettings = { variableDefinitions: {} },
  componentVariablesOverwrites,
}: {
  variableData: ComponentPropertyValue;
  defaultBreakpoint: string;
  componentSettings?: ExperienceComponentSettings;
  componentVariablesOverwrites?: Record<string, ComponentPropertyValue>;
}) => {
  if (variableData?.type === 'DesignValue') {
    return variableData.valuesByBreakpoint[defaultBreakpoint] || {};
  } else if (variableData?.type === 'ComponentValue') {
    const variableDefinitionKey = variableData.key;
    const variableDefinition = componentSettings.variableDefinitions[variableDefinitionKey];
    const defaultValue = variableDefinition.defaultValue;
    const userSetValue = componentVariablesOverwrites?.[variableDefinitionKey];
    if (!userSetValue || userSetValue.type === 'ComponentValue') {
      return (defaultValue as DesignValue)?.valuesByBreakpoint[defaultBreakpoint] || '';
    }
    return resolveVariable({
      variableData: userSetValue,
      defaultBreakpoint,
      componentSettings,
      componentVariablesOverwrites,
    });
  }
};

/**
 * Takes the initial set of properties, filters only design properties that will be mapped to CSS and
 * re-organizes them to be indexed by breakpoint ID ("breakpoint > variable > value"). It will
 * also resolve the design/ component values to plain values.
 *
 * **Example Input**
 * ```
 * variables = {
 *   cfMargin: { type: 'DesignValue', valuesByBreakpoint: { desktop: '1px', tablet: '2px' } },
 *   cfPadding: { type: 'DesignValue', valuesByBreakpoint: { desktop: '3px', mobile: '4px' } }
 * }
 * ```
 *
 * **Example Output**
 * ```
 * variableValuesByBreakpoints = {
 *   desktop: {
 *     cfMargin: '1px',
 *     cfPadding: '3px'
 *   },
 *   tablet: {
 *     cfMargin: '2px'
 *   },
 *   mobile: {
 *    cfPadding: '4px'
 *   }
 * }
 * ```
 *
 * **Note**
 * - The property cfBackgroundImageUrl is the only content property that gets mapped to CSS as well.
 *   It will be solely stored on the default breakpoint.
 * - For ComponentValues, it will either take the override from the pattern instance or fallback to
 *   the defaultValue defined in variableDefinitions.
 */
export const indexByBreakpoint = ({
  variables,
  breakpointIds,
  getBoundEntityById,
  unboundValues = {},
  dataSource = {},
  componentVariablesOverwrites,
  componentSettings = { variableDefinitions: {} },
}: {
  variables: Record<string, ComponentPropertyValue>;
  breakpointIds: string[];
  getBoundEntityById: (id: string) => Entry | Asset | undefined;
  unboundValues?: ExperienceUnboundValues;
  dataSource?: ExperienceDataSource;
  componentVariablesOverwrites?: Record<string, ComponentPropertyValue>;
  componentSettings?: ExperienceComponentSettings;
}) => {
  const variableValuesByBreakpoints = breakpointIds.reduce<
    Record<string, Record<string, Exclude<PrimitiveValue, undefined>>>
  >((acc, breakpointId) => {
    return {
      ...acc,
      [breakpointId]: {},
    };
  }, {});

  const defaultBreakpoint = breakpointIds[0];

  for (const [variableName, variableData] of Object.entries(variables)) {
    // handling the special case - cfBackgroundImageUrl variable, which can be bound or unbound
    // so, we need to resolve it here and pass it down as a css property to be converted into the CSS

    // I used .startsWith() cause it can be part of a pattern node
    if (
      variableName === 'cfBackgroundImageUrl' ||
      // TODO: Test this for nested patterns as the name might be just a random hash without the actual name (needs to be validated).
      variableName.startsWith('cfBackgroundImageUrl_')
    ) {
      const width = resolveVariable({
        variableData: variables['cfWidth'],
        defaultBreakpoint,
        componentSettings,
        componentVariablesOverwrites,
      }) as string;

      const options = resolveVariable({
        variableData: variables['cfBackgroundImageOptions'],
        defaultBreakpoint,
        componentSettings,
        componentVariablesOverwrites,
      }) as BackgroundImageOptions;

      if (!options) {
        console.error(
          `Error transforming image asset: Required variable [cfBackgroundImageOptions] missing from component definition`,
        );
        continue;
      }

      const imageUrl = resolveBackgroundImageBinding({
        variableData,
        getBoundEntityById,
        unboundValues,
        dataSource,
        componentSettings,
        componentVariablesOverwrites,
        width,
        options,
      });

      if (imageUrl) {
        variableValuesByBreakpoints[defaultBreakpoint][variableName] = imageUrl;
      }

      continue;
    }

    let resolvedVariableData = variableData;

    if (variableData.type === 'ComponentValue') {
      const variableDefinition = componentSettings?.variableDefinitions[variableData.key];
      const defaultValue = variableDefinition.defaultValue as ComponentPropertyValue;
      if (variableDefinition.group === 'style' && defaultValue !== undefined) {
        const overwriteVariableData = componentVariablesOverwrites?.[variableData.key];
        resolvedVariableData = mergeDefaultAndOverwriteValues(defaultValue, overwriteVariableData);
      }
    }

    if (resolvedVariableData.type !== 'DesignValue') {
      continue;
    }

    for (const [breakpointId, variableValue] of Object.entries(
      resolvedVariableData.valuesByBreakpoint,
    )) {
      if (!isValidBreakpointValue(variableValue)) {
        continue;
      }

      variableValuesByBreakpoints[breakpointId] = {
        ...variableValuesByBreakpoints[breakpointId],
        [variableName]: variableValue,
      };
    }
  }

  return variableValuesByBreakpoints;
};

/**
 * Flattens the object from
 * `{ color: { [key]: [value] } }`
 * to
 * `{ 'color.key': [value] }`
 */
export const flattenDesignTokenRegistry = (
  designTokenRegistry: DesignTokensDefinition,
): FlattenedDesignTokens => {
  return Object.entries(designTokenRegistry).reduce((acc, [categoryName, tokenCategory]) => {
    const tokensWithCategory = Object.entries(tokenCategory).reduce(
      (acc, [tokenName, tokenValue]) => {
        return {
          ...acc,
          [`${categoryName}.${tokenName}`]: tokenValue,
        };
      },
      {},
    );

    return {
      ...acc,
      ...tokensWithCategory,
    };
  }, {});
};

type MediaQueryData = { condition: string; cssByClassName: Record<string, string> };
/**
 * Create a single CSS string containing all class definitions for a given media query.
 *
 * @param condition e.g. "*", "<520px", ">520px"
 * @param cssByClassName map of class names to CSS strings containing all rules for each class
 * @returns joined string of all CSS class definitions wrapped into media queries
 */
export const toMediaQuery = ({ condition, cssByClassName }: MediaQueryData): string => {
  const mediaQueryStyles = Object.entries(cssByClassName).reduce<string>(
    (acc, [className, css]) => {
      return `${acc}.${className}{${css}}`;
    },
    ``,
  );

  if (condition === '*') {
    return mediaQueryStyles;
  }

  const [evaluation, pixelValue] = [condition[0], condition.substring(1)];

  const mediaQueryRule = evaluation === '<' ? 'max-width' : 'min-width';

  return `@media(${mediaQueryRule}:${pixelValue}){${mediaQueryStyles}}`;
};

function mergeDefaultAndOverwriteValues(
  defaultValue: ComponentPropertyValue,
  overwriteValue?: ComponentPropertyValue,
): ComponentPropertyValue;
function mergeDefaultAndOverwriteValues(
  defaultValue?: ComponentPropertyValue,
  overwriteValue?: ComponentPropertyValue,
): ComponentPropertyValue | undefined;
function mergeDefaultAndOverwriteValues(
  defaultValue?: ComponentPropertyValue,
  overwriteValue?: ComponentPropertyValue,
): ComponentPropertyValue | undefined {
  if (defaultValue?.type === 'DesignValue' && overwriteValue?.type === 'DesignValue') {
    return mergeDesignValuesByBreakpoint(defaultValue, overwriteValue);
  }
  return overwriteValue ?? defaultValue;
}
