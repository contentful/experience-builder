import { useEditorStore } from '@/store/editor';
import {
  buildCfStyles,
  calculateNodeDefaultHeight,
  isLinkToAsset,
  isContentfulStructureComponent,
  transformBoundContentValue,
  resolveHyperlinkPattern,
  isStructureWithRelativeHeight,
  sanitizeNodeProps,
} from '@contentful/experiences-core';
import { ASSEMBLY_NODE_TYPE, EMPTY_CONTAINER_HEIGHT } from '@contentful/experiences-core/constants';
import type {
  StyleProps,
  PrimitiveValue,
  ExperienceTreeNode,
  ResolveDesignValueType,
  ComponentRegistration,
  Link,
  DesignValue,
  StructureComponentProps,
} from '@contentful/experiences-core/types';
import { useMemo } from 'react';
import { useEditorModeClassName } from './useEditorModeClassName';
import { getUnboundValues } from '@/utils/getUnboundValues';
import { useEntityStore } from '@/store/entityStore';

import { Entry } from 'contentful';
import { HYPERLINK_DEFAULT_PATTERN } from '@contentful/experiences-core/constants';

type BaseComponentProps = Partial<StyleProps> &
  Record<string, PrimitiveValue | Link<'Entry'> | Link<'Asset'>>;

type ResolvedComponentProps = StructureComponentProps<
  BaseComponentProps & {
    className: string;
    isInExpEditorMode?: boolean;
  }
>;

type UseComponentProps = {
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  definition?: ComponentRegistration['definition'];
  options?: ComponentRegistration['options'];
  slotId?: string;
};

export const useComponentProps = ({
  node,
  resolveDesignValue,
  definition,
  options,
}: UseComponentProps): { componentProps: ResolvedComponentProps } => {
  const unboundValues = useEditorStore((state) => state.unboundValues);
  const hyperlinkPattern = useEditorStore((state) => state.hyperLinkPattern);
  const locale = useEditorStore((state) => state.locale);
  const dataSource = useEditorStore((state) => state.dataSource);
  const entityStore = useEntityStore((state) => state.entityStore);
  const areEntitiesFetched = useEntityStore((state) => state.areEntitiesFetched);

  const props: BaseComponentProps = useMemo(() => {
    const propsBase = {
      cfSsrClassName: node.data.props.cfSsrClassName
        ? (resolveDesignValue(
            (node.data.props.cfSsrClassName as DesignValue).valuesByBreakpoint,
          ) as string)
        : undefined,
    };

    // Don't enrich the assembly wrapper node with props
    if (!definition || node.type === ASSEMBLY_NODE_TYPE) {
      return propsBase;
    }

    // Note, that here we iterate over DEFINITION variables, not the actual node variables
    // this means that node may have "orphan" props, or some "newborn" props will be initialized
    // with the default values.
    const extractedProps = Object.entries(definition.variables).reduce(
      (acc, [variableName, variableDefinition]) => {
        const variableMapping = node.data.props[variableName];
        if (!variableMapping) {
          return {
            ...acc,
            [variableName]: variableDefinition.defaultValue,
          };
        }

        if (variableMapping.type === 'DesignValue') {
          const valuesByBreakpoint = resolveDesignValue(
            variableMapping.valuesByBreakpoint,
            variableName,
          );
          const designValue =
            variableName === 'cfHeight'
              ? calculateNodeDefaultHeight({
                  blockId: node.data.blockId,
                  children: node.children,
                  value: valuesByBreakpoint,
                })
              : valuesByBreakpoint;

          return {
            ...acc,
            [variableName]: designValue,
          };
        } else if (variableMapping.type === 'HyperlinkValue') {
          const binding = dataSource[variableMapping.linkTargetKey];

          const hyperlinkEntry = entityStore.getEntryOrAsset(
            binding,
            variableMapping.linkTargetKey,
          );
          return {
            ...acc,
            [variableName]: resolveHyperlinkPattern(
              definition.hyperlinkPattern || hyperlinkPattern || HYPERLINK_DEFAULT_PATTERN,
              hyperlinkEntry as Entry,
              locale,
            ),
          };
        } else if (variableMapping.type === 'BoundValue') {
          const [, uuid, path] = variableMapping.path.split('/');
          const binding = dataSource[uuid] as Link<'Entry' | 'Asset'>;

          const variableDefinition = definition.variables[variableName];
          let boundValue = transformBoundContentValue(
            node.data.props,
            entityStore,
            binding,
            resolveDesignValue,
            variableName,
            variableDefinition.type,
            variableMapping.path,
          );

          // In some cases, there may be an asset linked in the path, so we need to consider this scenario:
          // If no 'boundValue' is found, we also attempt to extract the value associated with the second-to-last item in the path.
          // If successful, it means we have identified the linked asset.

          if (!boundValue) {
            const maybeBoundAsset = areEntitiesFetched
              ? entityStore.getValue(binding, path.split('/').slice(0, -2))
              : undefined;

            if (isLinkToAsset(maybeBoundAsset)) {
              boundValue = maybeBoundAsset;
            }
          }

          const value = boundValue || variableDefinition.defaultValue;

          return {
            ...acc,
            [variableName]: value,
          };
        } else if (variableMapping.type === 'UnboundValue') {
          const value = getUnboundValues({
            key: variableMapping.key,
            fallback: variableDefinition.defaultValue,
            unboundValues: unboundValues || {},
          });

          return {
            ...acc,
            [variableName]: value,
          };
        } else if (variableMapping.type === 'ComponentValue') {
          // We are rendering a pattern (assembly) entry. Content properties cannot be edited in this,
          // so we always render the default value
          return {
            ...acc,
            // This can either a design (style) or a content variable
            [variableName]: variableDefinition.defaultValue,
          };
        } else {
          return { ...acc };
        }
      },
      {},
    );

    return {
      ...propsBase,
      ...extractedProps,
    };
  }, [
    hyperlinkPattern,
    node,
    locale,
    definition,
    resolveDesignValue,
    dataSource,
    areEntitiesFetched,
    unboundValues,
    entityStore,
  ]);

  const cfStyles = useMemo(() => buildCfStyles(props as StyleProps), [props]);

  // Styles that will be applied to the component element
  const componentStyles = useMemo(
    () => ({
      ...cfStyles,
      ...(!node.children.length &&
        isStructureWithRelativeHeight(node.data.blockId, cfStyles.height) && {
          minHeight: EMPTY_CONTAINER_HEIGHT,
        }),
    }),
    [cfStyles, node.children.length, node.data.blockId],
  );

  const cfCsrClassName = useEditorModeClassName({
    styles: componentStyles,
    nodeId: node.data.id,
  });

  const componentProps = useMemo(() => {
    const sharedProps = {
      'data-cf-node-id': node.data.id,
      'data-cf-node-block-id': node.data.blockId,
      'data-cf-node-block-type': node.type,
      className: (props.cfSsrClassName as string | undefined) ?? cfCsrClassName,
    };

    // Only pass `editorMode` and `node` to structure components and assembly root nodes.
    const isStructureComponent = isContentfulStructureComponent(node.data.blockId);
    if (isStructureComponent) {
      return {
        ...sharedProps,
        editorMode: true as const,
        node,
      };
    }

    return {
      ...sharedProps,
      // Allows custom components to render differently in the editor. This needs to be activated
      // through options as the component has to be aware of this prop to not cause any React warnings.
      ...(options?.enableCustomEditorView ? { isInExpEditorMode: true } : {}),
      ...sanitizeNodeProps(props),
    };
  }, [cfCsrClassName, node, options?.enableCustomEditorView, props]);

  return { componentProps };
};
