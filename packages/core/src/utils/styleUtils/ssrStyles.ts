import md5 from 'md5';
import { Asset, Entry, UnresolvedLink } from 'contentful/dist/types/types';
import {
  ComponentPropertyValue,
  DesignValue,
  ExperienceComponentSettings,
  ExperienceComponentTree,
  ExperienceDataSource,
  ExperienceUnboundValues,
} from '@contentful/experiences-validators';
import { buildCfStyles, checkIsAssemblyNode, isValidBreakpointValue } from '@/utils';
import { builtInStyles, optionalBuiltInStyles } from '@/definitions';
import { designTokensRegistry } from '@/registries';
import {
  ComponentTreeNode,
  DesignTokensDefinition,
  Experience,
  StyleProps,
  Breakpoint,
} from '@/types';
import { CF_STYLE_ATTRIBUTES } from '@/constants';
import { generateRandomId } from '@/utils';
import { createJoinedCSSRules } from './stylesUtils';

type MediaQueryTemplate = Record<
  string,
  { condition: string; cssByClassName: Record<string, string> }
>;

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
  const mediaQueriesTemplate = breakpoints.reduce(
    (mediaQueryTemplate: MediaQueryTemplate, breakpoint: Breakpoint) => {
      return {
        ...mediaQueryTemplate,
        [breakpoint.id]: {
          condition: breakpoint.query,
          cssByClassName: {} as Record<string, string>,
        },
      };
    },
    {},
  );

  // getting the breakpoint ids
  const breakpointIds = Object.keys(mediaQueriesTemplate);

  const iterateOverTreeAndExtractStyles = ({
    componentTree,
    dataSource,
    unboundValues,
    componentSettings,
    componentVariablesOverwrites,
    patternWrapper,
    wrappingPatternIds,
    patternNodeIdsChain = '',
  }: {
    componentTree: ExperienceComponentTree;
    dataSource: ExperienceDataSource;
    unboundValues: ExperienceUnboundValues;
    componentSettings?: ExperienceComponentSettings;
    componentVariablesOverwrites?: Record<string, ComponentPropertyValue>;
    patternWrapper?: ComponentTreeNode;
    wrappingPatternIds: Set<string>;
    patternNodeIdsChain?: string;
  }) => {
    // traversing the tree
    const queue: ComponentTreeNode[] = [];

    queue.push(...componentTree.children);

    let currentNode: ComponentTreeNode | undefined = undefined;

    // for each tree node
    while (queue.length) {
      currentNode = queue.shift();

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

        // TODO: Why are we creating default styles here and where are they rendered in the end?
        const defaultPatternDivStyles = buildCfStyles({});
        const cssRules = createJoinedCSSRules(defaultPatternDivStyles);

        // Create a hash to ensure stability and prefix to make sure the value can be processed
        const className = `cf-${md5(cssRules)}`;

        for (const breakpointId of breakpointIds) {
          if (!mediaQueriesTemplate[breakpointId].cssByClassName[className]) {
            mediaQueriesTemplate[breakpointId].cssByClassName[className] = cssRules;
          }
        }

        // When iterating over instances of the same pattern, we will iterate over the identical
        // pattern nodes again for every instance. Make sure to not overwrite the values from previous instances.
        if (!currentNode.variables.cfSsrClassName) {
          currentNode.variables.cfSsrClassName = {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [breakpointIds[0]]: className,
            },
          };
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
          patternNodeIdsChain: `${patternNodeIdsChain}${currentNode.id}`,
        });
        continue;
      }

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

      const currentNodeClassNames: string[] = [];

      // then for each breakpoint
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
        const cssRules = createJoinedCSSRules(cfStyles);

        // I create a hash of the object above because that would ensure hash stability
        // Adding breakpointId to ensure not using the same IDs between breakpoints as this leads to
        // conflicts between different breakpoint values from multiple nodes where the hash would be equal
        const styleHash = md5(breakpointId + cssRules);

        // and prefix the className to make sure the value can be processed
        const className = `cf-${styleHash}`;

        // I save the generated hashes into an array to later save it in the tree node
        // as cfSsrClassName prop
        // making sure to avoid the duplicates in case styles for > 1 breakpoints are the same
        if (!currentNodeClassNames.includes(className)) {
          currentNodeClassNames.push(className);
        }

        // if there is already the similar hash - no need to over-write it
        if (mediaQueriesTemplate[breakpointId].cssByClassName[className]) {
          continue;
        }

        // otherwise, save it to the stylesheet
        mediaQueriesTemplate[breakpointId].cssByClassName[className] = cssRules;
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
        currentNode.id = currentNode.id || generateRandomId(5);
        // @ts-expect-error -- valueByBreakpoint is not explicitly defined, but it's already defined in the patternWrapper styles
        patternWrapper.variables.cfSsrClassName = {
          ...(patternWrapper.variables.cfSsrClassName ?? {}),
          type: 'DesignValue',
          // Chain IDs to avoid overwriting styles across multiple instances of the same pattern
          [`${patternNodeIdsChain}${currentNode.id}`]: {
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
  const stylesheet = Object.entries(mediaQueriesTemplate).reduce((acc, [, breakpointPayload]) => {
    return `${acc}${toMediaQuery(breakpointPayload as { condition: string; cssByClassName: Record<string, string> })}`;
  }, '');

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

        // The overwriting value is either a custom value from the experience or default value from a
        // wrapping pattern node that got trickled down to this nesting level.
        resolvedValues[propertyName] = overwritingValue ?? propertyDefinition?.defaultValue;
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

export const resolveBackgroundImageBinding = ({
  variableData,
  getBoundEntityById,
  dataSource = {},
  unboundValues = {},
  componentVariablesOverwrites,
  componentSettings = { variableDefinitions: {} },
}: {
  variableData: ComponentPropertyValue;
  getBoundEntityById: (id: string) => Entry | Asset | undefined;
  unboundValues?: ExperienceUnboundValues;
  dataSource?: ExperienceDataSource;
  componentSettings?: ExperienceComponentSettings;
  // patternNode.variables - a place which contains bindings scoped to the pattern
  componentVariablesOverwrites?: Record<string, ComponentPropertyValue>;
}): string | undefined => {
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

    const userSetValue = componentVariablesOverwrites?.[variableDefinitionKey];

    // userSetValue is a ComponentValue we can safely return the default value
    if (!userSetValue || userSetValue.type === 'ComponentValue') {
      return defaultValue as string | undefined;
    }

    // at this point userSetValue will either be type of 'DesignValue' or 'BoundValue'
    // so we recursively run resolution again to resolve it
    const resolvedValue = resolveBackgroundImageBinding({
      variableData: userSetValue,
      getBoundEntityById,
      dataSource,
      unboundValues,
      componentVariablesOverwrites,
      componentSettings,
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
      return (boundEntity as Asset).fields.file?.url as string;
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

        return referencedAsset.fields.file?.url as string;
      }
    }
  }
};

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
  const variableValuesByBreakpoints = breakpointIds.reduce<Record<string, Record<string, unknown>>>(
    (acc, breakpointId) => {
      return {
        ...acc,
        [breakpointId]: {},
      };
    },
    {},
  );

  const defaultBreakpoint = breakpointIds[0];

  for (const [variableName, variableData] of Object.entries(variables)) {
    // handling the special case - cfBackgroundImageUrl variable, which can be bound or unbound
    // so, we need to resolve it here and pass it down as a css property to be convereted into the CSS

    // I used .startsWith() cause it can be part of a pattern node
    if (
      variableName === 'cfBackgroundImageUrl' ||
      variableName.startsWith('cfBackgroundImageUrl_')
    ) {
      const imageUrl = resolveBackgroundImageBinding({
        variableData,
        getBoundEntityById,
        unboundValues,
        dataSource,
        componentSettings,
        componentVariablesOverwrites,
      });

      if (imageUrl) {
        variableValuesByBreakpoints[defaultBreakpoint][variableName] = imageUrl;
      }

      continue;
    }

    let resolvedVariableData = variableData;

    if (variableData.type === 'ComponentValue') {
      const variableDefinition = componentSettings?.variableDefinitions[variableData.key];
      if (variableDefinition.group === 'style' && variableDefinition.defaultValue !== undefined) {
        const overrideVariableData = componentVariablesOverwrites?.[variableData.key];
        resolvedVariableData =
          overrideVariableData || (variableDefinition.defaultValue as ComponentPropertyValue);
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

export const toMediaQuery = (breakpointPayload: {
  condition: string;
  cssByClassName: Record<string, string>;
}): string => {
  const mediaQueryStyles = Object.entries(breakpointPayload.cssByClassName).reduce<string>(
    (acc, [className, css]) => {
      return `${acc}.${className}{${css}}`;
    },
    ``,
  );

  if (breakpointPayload.condition === '*') {
    return mediaQueryStyles;
  }

  const [evaluation, pixelValue] = [
    breakpointPayload.condition[0],
    breakpointPayload.condition.substring(1),
  ];

  const mediaQueryRule = evaluation === '<' ? 'max-width' : 'min-width';

  return `@media(${mediaQueryRule}:${pixelValue}){${mediaQueryStyles}}`;
};
