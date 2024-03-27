import { useEditorStore } from '@/store/editor';
import {
  buildCfStyles,
  calculateNodeDefaultHeight,
  isLinkToAsset,
  isEmptyStructureWithRelativeHeight,
  isContentfulStructureComponent,
  transformBoundContentValue,
} from '@contentful/experiences-core';
import {
  CF_STYLE_ATTRIBUTES,
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
} from '@contentful/experiences-core/types';
import { useMemo } from 'react';
import { useStyleTag } from '../../hooks/useStyleTag';
import { omit } from 'lodash-es';
import { getUnboundValues } from '@/utils/getUnboundValues';
import { useEntityStore } from '@/store/entityStore';
import type { RenderDropzoneFunction } from './Dropzone.types';
import { DRAG_PADDING } from '../../types/constants';

type ComponentProps = StyleProps | Record<string, PrimitiveValue | Link<'Entry'> | Link<'Asset'>>;

type UseComponentProps = {
  node: ExperienceTreeNode;
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
    const propsBase = node.data.props?.cfSsrClassName
      ? {
          cfSsrClassName: node.data.props.cfSsrClassName,
        }
      : {};

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

  const cfStyles = buildCfStyles(props, node.data.blockId);

  // Separate the component styles from the editor wrapper styles
  const { margin, height, width, maxWidth, ...componentStyles } = cfStyles;

  // Styles that will be applied to the editor wrapper (draggable) element
  const { className: wrapperClass } = useStyleTag({
    styles:
      // To ensure that assembly nodes are rendered like they are rendered in
      // the assembly editor, we need to use a normal block instead of a flex box.
      node.type === ASSEMBLY_NODE_TYPE
        ? {
            display: 'block !important',
            width: '100%',
          }
        : {
            margin,
            maxWidth,
            width,
            height,
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
        isContentfulStructureComponent(node?.data.blockId) &&
        node?.data.blockId !== CONTENTFUL_COMPONENTS.divider.id &&
        node?.data.blockId !== CONTENTFUL_COMPONENTS.columns.id && {
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

  //List explicit style props that will end up being passed to the component
  const stylesToKeep = ['cfImageAsset'];
  const stylesToRemove = CF_STYLE_ATTRIBUTES.filter((style) => !stylesToKeep.includes(style));

  const componentProps = {
    className: props.cfSsrClassName ?? componentClass,
    editorMode: true,
    node,
    renderDropzone,
    ...omit(props, stylesToRemove, ['cfHyperlink', 'cfOpenInNewTab']),
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
        return (parsedValue < DRAG_PADDING ? DRAG_PADDING : parsedValue) + 'px';
      }
      return `${DRAG_PADDING}px`;
    })
    .join(' ');
