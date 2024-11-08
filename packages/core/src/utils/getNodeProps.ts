import { EntityStore } from '@/entity';
import { ComponentRegistration, Experience, ResolveDesignValueType } from '@/types';
import { ComponentTreeNode, DesignValue, PrimitiveValue } from '@contentful/experiences-validators';
import { transformBoundContentValue } from './transformers';
import { Entry, UnresolvedLink } from 'contentful';
import { resolveHyperlinkPattern } from './resolveHyperlinkPattern';
import { HYPERLINK_DEFAULT_PATTERN } from '@/constants';

interface GetNodePropsParams {
  node: ComponentTreeNode;
  componentRegistration: ComponentRegistration | undefined;
  isAssembly: boolean;
  getPatternChildNodeClassName?: (childNodeId: string) => string | undefined;
  entityStore: EntityStore;
  locale: string;
  hyperlinkPattern: string | undefined;
  resolveDesignValue: ResolveDesignValueType;
  experience?: Experience<EntityStore> | string | null;
}

export const getNodeProps = ({
  node,
  componentRegistration,
  isAssembly,
  getPatternChildNodeClassName,
  entityStore,
  locale,
  hyperlinkPattern,
  experience,
  resolveDesignValue,
}: GetNodePropsParams) => {
  // Don't enrich the assembly wrapper node with props
  if (!componentRegistration || isAssembly) {
    return {
      cfSsrClassName: node.variables.cfSsrClassName
        ? resolveDesignValue(
            (node.variables.cfSsrClassName as DesignValue).valuesByBreakpoint,
            'cfSsrClassName',
          )
        : undefined,
    };
  }

  const propMap: Record<string, PrimitiveValue> = {
    // @ts-expect-error -- node id is being generated in ssrStyles.ts, currently missing ComponentTreeNode type
    cfSsrClassName: node.id
      ? // @ts-expect-error -- node id is being generated in ssrStyles.ts, currently missing ComponentTreeNode type
        getPatternChildNodeClassName?.(node.id)
      : node.variables.cfSsrClassName
        ? resolveDesignValue(
            (node.variables.cfSsrClassName as DesignValue).valuesByBreakpoint,
            'cfSsrClassName',
          )
        : undefined,
  };

  const props = Object.entries(componentRegistration.definition.variables).reduce(
    (acc, [variableName, variableDefinition]) => {
      const variable = node.variables[variableName];
      if (!variable) return acc;

      switch (variable.type) {
        case 'DesignValue':
          acc[variableName] = resolveDesignValue(variable.valuesByBreakpoint, variableName);
          break;
        case 'BoundValue': {
          const [, uuid] = variable.path.split('/');
          const binding = entityStore.dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;

          const value = transformBoundContentValue(
            node.variables,
            entityStore,
            binding,
            resolveDesignValue,
            variableName,
            variableDefinition,
            variable.path,
          );
          acc[variableName] = value ?? variableDefinition.defaultValue;
          break;
        }

        case 'HyperlinkValue': {
          const binding = entityStore.dataSource[variable.linkTargetKey];
          const hyperlinkEntry = entityStore.getEntryOrAsset(binding, variable.linkTargetKey);

          const value = resolveHyperlinkPattern(
            componentRegistration.definition.hyperlinkPattern ||
              hyperlinkPattern ||
              HYPERLINK_DEFAULT_PATTERN,
            hyperlinkEntry as Entry,
            locale,
          );
          if (value) {
            acc[variableName] = value;
          }
          break;
        }
        case 'UnboundValue': {
          const uuid = variable.key;
          acc[variableName] =
            entityStore.unboundValues[uuid]?.value ?? variableDefinition.defaultValue;
          break;
        }
        case 'ComponentValue':
          // We're rendering a pattern entry. Content cannot be set for ComponentValue type properties
          // directly in the pattern so we can safely use the default value
          // This can either a design (style) or a content variable
          acc[variableName] = variableDefinition.defaultValue;
          break;
        default:
          break;
      }
      return acc;
    },
    propMap,
  );

  return props;
};
