import md5 from 'md5';
import { Asset, Entry, UnresolvedLink } from 'contentful/dist/types/types';
import {
  ComponentPropertyValue,
  ExperienceComponentSettings,
  ExperienceComponentTree,
  ExperienceDataSource,
  ExperienceUnboundValues,
} from '@contentful/experiences-validators';
import { buildCfStyles, checkIsAssemblyNode, toCSSAttribute } from '@/utils';
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
//import { componentRegistry } from '../core/componentRegistry';

type MediaQueryTemplate = Record<
  string,
  { condition: string; cssByClassName: Record<string, string> }
>;

export const detachExperienceStyles = (experience: Experience): string | undefined => {
  const experienceTreeRoot = experience.entityStore?.experienceEntryFields
    ?.componentTree as ExperienceComponentTree;

  if (!experienceTreeRoot) {
    return;
  }

  const mapOfDesignVariableKeys = flattenDesignTokenRegistry(designTokensRegistry);

  // getting breakpoints from the entry componentTree field
  /**
   * breakpoints [
      {
        id: 'desktop',
        query: '*',
        displayName: 'All Sizes',
        previewSize: '100%'
      },
      {
        id: 'tablet',
        query: '<992px',
        displayName: 'Tablet',
        previewSize: '820px'
      },
      {
        id: 'mobile',
        query: '<576px',
        displayName: 'Mobile',
        previewSize: '390px'
      }
    ]
   */
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
  }: {
    componentTree: ExperienceComponentTree;
    dataSource: ExperienceDataSource;
    unboundValues: ExperienceUnboundValues;
    componentSettings?: ExperienceComponentSettings;
    componentVariablesOverwrites?: Record<string, ComponentPropertyValue>;
  }) => {
    // traversing the tree
    const queue: ComponentTreeNode[] = [];

    queue.push(...componentTree.children);

    let currentNode: ComponentTreeNode | undefined = undefined;

    // const registeredComponenIds = Array.from(componentRegistry.values()).map(
    //   ({ definition }) => definition.id,
    // );

    // for each tree node
    while (queue.length) {
      currentNode = queue.shift();

      if (!currentNode) {
        break;
      }

      const usedComponents = experience.entityStore?.experienceEntryFields?.usedComponents ?? [];

      //const isPatternNode = !registeredComponenIds.includes(currentNode.definitionId);
      const isPatternNode = checkIsAssemblyNode({
        componentId: currentNode.definitionId,
        usedComponents,
      });

      if (isPatternNode) {
        const patternEntry = usedComponents.find(
          (component) => component.sys.id === currentNode!.definitionId,
        );

        if (!patternEntry || !('fields' in patternEntry)) {
          continue;
        }

        const defaultPatternDivStyles: Record<string, string> = Object.fromEntries(
          Object.entries(buildCfStyles({}))
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => [toCSSAttribute(key), value]),
        );

        // I create a hash of the object above because that would ensure hash stability
        const styleHash = md5(JSON.stringify(defaultPatternDivStyles));

        // and prefix the className to make sure the value can be processed
        const className = `cf-${styleHash}`;

        for (const breakpointId of breakpointIds) {
          if (!mediaQueriesTemplate[breakpointId].cssByClassName[className]) {
            mediaQueriesTemplate[breakpointId].cssByClassName[className] =
              toCSSString(defaultPatternDivStyles);
          }
        }

        currentNode.variables.cfSsrClassName = {
          type: 'DesignValue',
          valuesByBreakpoint: {
            [breakpointIds[0]]: className,
          },
        };

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
          componentVariablesOverwrites: currentNode.variables,
        });
        continue;
      }

      /** Variables value is stored in `valuesByBreakpoint` object
     * {
        cfVerticalAlignment: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'center' } },
        cfHorizontalAlignment: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'center' } },
        cfMargin: { type: 'DesignValue', valuesByBreakpoint: { desktop: '0 0 0 0' } },
        cfPadding: { type: 'DesignValue', valuesByBreakpoint: { desktop: '0 0 0 0' } },
        cfBackgroundColor: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: 'rgba(246, 246, 246, 1)' }
        },
        cfWidth: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'fill' } },
        cfHeight: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: 'fit-content' }
        },
        cfMaxWidth: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'none' } },
        cfFlexDirection: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'column' } },
        cfFlexWrap: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'nowrap' } },
        cfBorder: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: '0px solid rgba(0, 0, 0, 0)' }
        },
        cfBorderRadius: { type: 'DesignValue', valuesByBreakpoint: { desktop: '0px' } },
        cfGap: { type: 'DesignValue', valuesByBreakpoint: { desktop: '0px 0px' } },
        cfHyperlink: { type: 'UnboundValue', key: 'VNc49Qyepd6IzN7rmKUyS' },
        cfOpenInNewTab: { type: 'UnboundValue', key: 'ZA5YqB2fmREQ4pTKqY5hX' },
        cfBackgroundImageUrl: { type: 'UnboundValue', key: 'FeskH0WbYD5_RQVXX-1T8' },
        cfBackgroundImageOptions: { type: 'DesignValue', valuesByBreakpoint: { desktop: [Object] } }
      }
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
      /**
     * propsByBreakpoint {
        desktop: {
          cfVerticalAlignment: 'center',
          cfHorizontalAlignment: 'center',
          cfMargin: '0 0 0 0',
          cfPadding: '0 0 0 0',
          cfBackgroundColor: 'rgba(246, 246, 246, 1)',
          cfWidth: 'fill',
          cfHeight: 'fit-content',
          cfMaxWidth: 'none',
          cfFlexDirection: 'column',
          cfFlexWrap: 'nowrap',
          cfBorder: '0px solid rgba(0, 0, 0, 0)',
          cfBorderRadius: '0px',
          cfGap: '0px 0px',
          cfBackgroundImageOptions: { scaling: 'fill', alignment: 'left top', targetSize: '2000px' }
        },
        tablet: {},
        mobile: {}
      }
     */

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

        // We convert cryptic prop keys to css variables
        // Eg: cfMargin to margin
        const stylesForBreakpoint = buildCfStyles(propsByBreakpointWithResolvedDesignTokens);

        const stylesForBreakpointWithoutUndefined: Record<string, string> = Object.fromEntries(
          Object.entries(stylesForBreakpoint)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => [toCSSAttribute(key), value]),
        );

        /**
       * stylesForBreakpoint {
          margin: '0 0 0 0',
          padding: '0 0 0 0',
          'background-color': 'rgba(246, 246, 246, 1)',
          width: '100%',
          height: 'fit-content',
          'max-width': 'none',
          border: '0px solid rgba(0, 0, 0, 0)',
          'border-radius': '0px',
          gap: '0px 0px',
          'align-items': 'center',
          'justify-content': 'safe center',
          'flex-direction': 'column',
          'flex-wrap': 'nowrap',
          'font-style': 'normal',
          'text-decoration': 'none',
          'box-sizing': 'border-box'
        }
       */

        // I create a hash of the object above because that would ensure hash stability
        const styleHash = md5(JSON.stringify(stylesForBreakpointWithoutUndefined));

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
        mediaQueriesTemplate[breakpointId].cssByClassName[className] = toCSSString(
          stylesForBreakpointWithoutUndefined,
        );
      }

      // all generated classNames are saved in the tree node
      // to be handled by the sdk later
      // each node will get N classNames, where N is the number of breakpoints
      // browsers process classNames in the order they are defined
      // meaning that in case of className1 className2 className3
      // className3 will win over className2 and className1
      // making sure that we respect the order of breakpoints from
      // we can achieve "desktop first" or "mobile first" approach to style over-writes
      currentNode.variables.cfSsrClassName = {
        type: 'DesignValue',
        valuesByBreakpoint: {
          [breakpointIds[0]]: currentNodeClassNames.join(' '),
        },
      };

      queue.push(...currentNode.children);
    }
  };

  iterateOverTreeAndExtractStyles({
    componentTree: experienceTreeRoot,
    dataSource: experience.entityStore?.dataSource ?? {},
    unboundValues: experience.entityStore?.unboundValues ?? {},
    componentSettings: experience.entityStore?.experienceEntryFields?.componentSettings,
  });

  // once the whole tree was traversed, for each breakpoint, I aggregate the styles
  // for each generated className into one css string
  const styleSheet = Object.entries(mediaQueriesTemplate).reduce((acc, [, breakpointPayload]) => {
    return `${acc}${toMediaQuery(breakpointPayload as { condition: string; cssByClassName: Record<string, string> })}`;
  }, '');

  return styleSheet;
};

export const isCfStyleAttribute = (variableName: any): variableName is keyof StyleProps => {
  return CF_STYLE_ATTRIBUTES.includes(variableName);
};

export const maybePopulateDesignTokenValue = (
  variableName: string,
  variableValue: any,
  mapOfDesignVariableKeys: Record<string, any>,
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
      const { width, style, color } = tokenValue;
      return `${width} ${style} ${color}`;
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

    // @ts-expect-error TODO: fix the types as it thinks taht `defaultValue` is of type string
    const defaultValueKey = variableDefinition.defaultValue?.key;
    const defaultValue = unboundValues[defaultValueKey].value;

    const userSetValue = componentVariablesOverwrites?.[variableDefinitionKey];

    if (!userSetValue) {
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
  const variableValuesByBreakpoints = breakpointIds.reduce<Record<string, Record<string, any>>>(
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

    if (variableData.type !== 'DesignValue') {
      continue;
    }

    for (const [breakpointId, variableValue] of Object.entries(variableData.valuesByBreakpoint)) {
      if (!variableValue) {
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
 * {
 *   color: {
 *      [key]: [value]
 *   }
 * }
 *
 * to
 *
 * {
 *  'color.key': [value]
 * }
 */
export const flattenDesignTokenRegistry = (
  designTokenRegistry: DesignTokensDefinition,
): Record<string, string | object> => {
  return Object.entries(designTokenRegistry).reduce((acc, [categoryName, tokenCategory]) => {
    const tokensWithCategory = Object.entries(tokenCategory as Record<string, any>).reduce(
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

// Replaces camelCase with kebab-case

// converts the <key, value> object into a css string
export const toCSSString = (breakpointStyles: Record<string, string>) => {
  return Object.entries(breakpointStyles)
    .map(([key, value]) => `${key}:${value};`)
    .join('');
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
