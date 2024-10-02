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
import {
  ASSEMBLY_NODE_TYPE,
  EMPTY_CONTAINER_HEIGHT,
  CONTENTFUL_COMPONENTS,
} from '@contentful/experiences-core/constants';
import type {
  StyleProps,
  PrimitiveValue,
  ExperienceTreeNode,
  ResolveDesignValueType,
  ComponentRegistration,
  Link,
  DesignValue,
} from '@contentful/experiences-core/types';
import { CSSProperties, useMemo } from 'react';
import { useEditorModeClassName } from '@/hooks/useEditorModeClassName';
import { getUnboundValues } from '@/utils/getUnboundValues';
import { useEntityStore } from '@/store/entityStore';
import type { RenderDropzoneFunction } from '@/components/DraggableBlock/Dropzone.types';

import { Entry } from 'contentful';
import { HYPERLINK_DEFAULT_PATTERN } from '@contentful/experiences-core/constants';
import { DRAG_PADDING } from '@/types/constants';

type ComponentProps = StyleProps | Record<string, PrimitiveValue | Link<'Entry'> | Link<'Asset'>>;

export type ResolvedComponentProps = ComponentProps & {
  children?: React.JSX.Element | undefined;
  className: string;
  editorMode: boolean;
  node: ExperienceTreeNode;
  renderDropzone: RenderDropzoneFunction;
};

type UseComponentProps = {
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  areEntitiesFetched: boolean;
  definition?: ComponentRegistration['definition'];
  renderDropzone: RenderDropzoneFunction;
  userIsDragging: boolean;
  slotId?: string;
};

export const useComponentProps = ({
  node,
  areEntitiesFetched,
  resolveDesignValue,
  renderDropzone,
  definition,
  userIsDragging,
}: UseComponentProps) => {
  const unboundValues = useEditorStore((state) => state.unboundValues);
  const hyperlinkPattern = useEditorStore((state) => state.hyperLinkPattern);
  const locale = useEditorStore((state) => state.locale);
  const dataSource = useEditorStore((state) => state.dataSource);
  const entityStore = useEntityStore((state) => state.entityStore);

  const isEmptyZone = !node.children.length;

  const props: ComponentProps = useMemo(() => {
    const propsBase = {
      cfSsrClassName: node.data.props.cfSsrClassName
        ? (resolveDesignValue(
            (node.data.props.cfSsrClassName as DesignValue).valuesByBreakpoint,
            'cfSsrClassName',
          ) as string)
        : undefined,
    };

    // Don't enrich the assembly wrapper node with props
    if (!definition || node.type === ASSEMBLY_NODE_TYPE) {
      return propsBase;
    }

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
            variableDefinition,
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

    const slotProps: Record<string, React.JSX.Element> = {};
    if (definition.slots) {
      for (const slotId in definition.slots) {
        slotProps[slotId] = renderDropzone(node, {
          zoneId: [node.data.id, slotId].join('|'),
        });
      }
    }

    return {
      ...propsBase,
      ...extractedProps,
      ...slotProps,
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
    renderDropzone,
  ]);

  const cfStyles = useMemo(() => buildCfStyles(props as StyleProps), [props]);

  const isAssemblyBlock = node.type === 'assemblyBlock';
  const isSingleColumn = node?.data.blockId === CONTENTFUL_COMPONENTS.columns.id;
  const isStructureComponent = isContentfulStructureComponent(node?.data.blockId);

  // Move size styles to the wrapping div and override the component styles
  const overrideStyles: CSSProperties = {};
  const sizeStyles: CSSProperties = {
    width: cfStyles.width,
    maxWidth: cfStyles.maxWidth,
  };
  if (!isStructureComponent) {
    sizeStyles.height = cfStyles.height;
    overrideStyles.height = '100%';
    overrideStyles.width = '100%';
  }

  // Styles that will be applied to the component element
  const componentClass = useEditorModeClassName({
    styles: {
      ...cfStyles,
      ...overrideStyles,
      ...(isEmptyZone &&
        isStructureWithRelativeHeight(node?.data.blockId, cfStyles.height) && {
          minHeight: EMPTY_CONTAINER_HEIGHT,
        }),
      ...(userIsDragging &&
        isStructureComponent &&
        !isSingleColumn &&
        !isAssemblyBlock && {
          padding: addExtraDropzonePadding(cfStyles.padding?.toString() || '0 0 0 0'),
        }),
    },
    nodeId: node.data.id,
  });

  const componentProps: ResolvedComponentProps = {
    'data-cf-node-id': node.data.id,
    'data-cf-node-block-id': node.data.blockId,
    'data-cf-node-block-type': node.type,
    className: (props.cfSsrClassName as string | undefined) ?? componentClass,
    editorMode: true,
    node,
    renderDropzone,
    ...sanitizeNodeProps(props),
    ...(definition?.children ? { children: renderDropzone(node) } : {}),
  };

  return { componentProps, sizeStyles };
};

const addExtraDropzonePadding = (padding: string) =>
  padding
    .split(' ')
    .map((value) =>
      parseFloat(value) === 0 ? `${DRAG_PADDING}px` : `calc(${value} + ${DRAG_PADDING}px)`,
    )
    .join(' ');
