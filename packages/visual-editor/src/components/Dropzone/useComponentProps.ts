import { useEditorStore } from '@/store/editor';
import {
  buildCfStyles,
  calculateNodeDefaultHeight,
  transformContentValue,
  isLinkToAsset,
  isEmptyStructureWithRelativeHeight,
  isContentfulStructureComponent,
} from '@contentful/experience-builder-core';
import {
  CF_STYLE_ATTRIBUTES,
  DESIGN_COMPONENT_NODE_TYPE,
  ASSEMBLY_NODE_TYPE,
  EMPTY_CONTAINER_HEIGHT,
  CONTENTFUL_COMPONENTS,
} from '@contentful/experience-builder-core/constants';
import type {
  StyleProps,
  CompositionVariableValueType,
  CompositionComponentNode,
  ResolveDesignValueType,
  ComponentRegistration,
  Link,
} from '@contentful/experience-builder-core/types';
import { useMemo } from 'react';
import { useStyleTag } from '../../hooks/useStyleTag';
import { omit } from 'lodash-es';
import { getUnboundValues } from '@/utils/getUnboundValues';
import { useEntityStore } from '@/store/entityStore';
import type { RenderDropzoneFunction } from './Dropzone.types';
import { DRAGGABLE_WIDTH } from '../../types/constants';

type ComponentProps =
  | StyleProps
  | Record<string, CompositionVariableValueType | Link<'Entry'> | Link<'Asset'>>;

type UseComponentProps = {
  node: CompositionComponentNode;
  resolveDesignValue: ResolveDesignValueType;
  areEntitiesFetched: boolean;
  definition: ComponentRegistration['definition'];
  renderDropzone: RenderDropzoneFunction;
  userIsDragging: boolean;
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
  const dataSource = useEditorStore((state) => state.dataSource);
  const entityStore = useEntityStore((state) => state.entityStore);
  const props: ComponentProps = useMemo(() => {
    // Don't enrich the assembly wrapper node with props
    if (
      !definition ||
      node.type === DESIGN_COMPONENT_NODE_TYPE ||
      node.type === ASSEMBLY_NODE_TYPE
    ) {
      return {};
    }

    return Object.entries(definition.variables).reduce(
      (acc, [variableName, variableDefinition]) => {
        const variableMapping = node.data.props[variableName];
        if (!variableMapping) {
          return {
            ...acc,
            [variableName]: variableDefinition.defaultValue,
          };
        }

        if (variableMapping.type === 'DesignValue') {
          const valueByBreakpoint = resolveDesignValue(
            variableMapping.valuesByBreakpoint,
            variableName,
          );
          const designValue =
            variableName === 'cfHeight'
              ? calculateNodeDefaultHeight({
                  blockId: node.data.blockId,
                  children: node.children,
                  value: valueByBreakpoint,
                })
              : valueByBreakpoint;

          return {
            ...acc,
            [variableName]: designValue,
          };
        } else if (variableMapping.type === 'BoundValue') {
          // // take value from the datasource for both bound and unbound value types
          const [, uuid, ...path] = variableMapping.path.split('/');
          const binding = dataSource[uuid] as Link<'Entry' | 'Asset'>;

          let boundValue: string | Link<'Asset'> | undefined = areEntitiesFetched
            ? entityStore.getValue(binding, path.slice(0, -1))
            : undefined;
          // In some cases, there may be an asset linked in the path, so we need to consider this scenario:
          // If no 'boundValue' is found, we also attempt to extract the value associated with the second-to-last item in the path.
          // If successful, it means we have identified the linked asset.

          if (!boundValue) {
            const maybeBoundAsset = areEntitiesFetched
              ? entityStore.getValue(binding, path.slice(0, -2))
              : undefined;

            if (isLinkToAsset(maybeBoundAsset)) {
              boundValue = maybeBoundAsset;
            }
          }

          if (typeof boundValue === 'object' && boundValue.sys?.linkType === 'Asset') {
            boundValue = entityStore?.getValue(boundValue, ['fields', 'file']);
          }

          const value = boundValue || variableDefinition.defaultValue;

          return {
            ...acc,
            [variableName]: transformContentValue(value, variableDefinition),
          };
        } else {
          const value = getUnboundValues({
            key: variableMapping.key,
            fallback: variableDefinition.defaultValue,
            unboundValues: unboundValues || {},
          });

          return {
            ...acc,
            [variableName]: value,
          };
        }
      },
      {},
    );
  }, [
    definition,
    node.data.props,
    node.children,
    node.data.blockId,
    resolveDesignValue,
    dataSource,
    areEntitiesFetched,
    unboundValues,
    node.type,
    entityStore,
  ]);

  const cfStyles = buildCfStyles(props);

  // Separate the component styles from the editor wrapper styles
  const { margin, height, width, maxWidth, ...componentStyles } = cfStyles;

  // Styles that will be applied to the editor wrapper (draggable) element
  const { className: wrapperClass } = useStyleTag({
    styles: {
      margin,
      height,
      width,
      maxWidth,
    },
    nodeId: `editor-${node.data.id}`,
  });

  // Styles that will be applied to the component element
  const { className: componentClass } = useStyleTag({
    styles: {
      ...componentStyles,
      margin: 0,
      width: '100%',
      height: '100%',
      maxWidth: 'none',
      ...(isEmptyStructureWithRelativeHeight(node.children.length, node?.data.blockId, height) && {
        minHeight: EMPTY_CONTAINER_HEIGHT,
      }),
      ...(userIsDragging &&
        isContentfulStructureComponent(node?.data.blockId, [CONTENTFUL_COMPONENTS.columns.id]) && {
          padding: addExtraDropzonePadding(componentStyles.padding?.toString() || '0 0 0 0'),
        }),
    },
    nodeId: node.data.id,
  });

  const wrapperProps = {
    className: wrapperClass,
    'data-cf-node-id': node.data.id,
    'data-cf-node-block-id': node.data.blockId,
    'data-cf-node-block-type': node.type,
  };

  const componentProps = {
    className: componentClass,
    editorMode: true,
    node,
    renderDropzone,
    ...omit(props, CF_STYLE_ATTRIBUTES, ['cfHyperlink', 'cfOpenInNewTab']),
    ...(definition.children ? { children: renderDropzone(node) } : {}),
  };

  return { componentProps, wrapperProps };
};

const addExtraDropzonePadding = (padding: string) =>
  padding
    .split(' ')
    .map((value) => {
      if (value.endsWith('px')) {
        const parsedValue = parseInt(value.replace(/px$/, ''), 10);
        return (parsedValue < DRAGGABLE_WIDTH ? DRAGGABLE_WIDTH : parsedValue) + 'px';
      }
      return `${DRAGGABLE_WIDTH}px`;
    })
    .join(' ');
