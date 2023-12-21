import React from 'react';
import { useEditorStore } from '@/store/editor';
import {
  buildCfStyles,
  calculateNodeDefaultHeight,
  transformContentValue,
  isLinkToAsset,
} from '@contentful/experience-builder-core';
import {
  CONTENTFUL_CONTAINER_ID,
  CF_STYLE_ATTRIBUTES,
  DESIGN_COMPONENT_NODE_TYPE,
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
import { useStyleTag } from './useStyleTag';
import omit from 'lodash-es/omit';
import { getUnboundValues } from '@/utils/getUnboundValues';
import { DropZone } from '@components/DropZone/Dropzone';
import { useEntityStore } from '@/store/entityStore';

type PropsType =
  | StyleProps
  | Record<string, CompositionVariableValueType | Link<'Entry'> | Link<'Asset'>>;

interface ComponentPropsParams {
  node: CompositionComponentNode;
  resolveDesignValue: ResolveDesignValueType;
  areEntitiesFetched: boolean;
  definition: ComponentRegistration['definition'];
}

export const useComponentProps = ({
  node,
  areEntitiesFetched,
  resolveDesignValue,
  definition,
}: ComponentPropsParams) => {
  const unboundValues = useEditorStore((state) => state.unboundValues);
  const dataSource = useEditorStore((state) => state.dataSource);
  const entityStore = useEntityStore((state) => state.entityStore);
  const props: PropsType = useMemo(() => {
    // Don't enrich the design component wrapper node with props
    if (!definition || node.type === DESIGN_COMPONENT_NODE_TYPE) {
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
            variableName
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

          if (
            typeof boundValue === 'object' &&
            (boundValue as Link<'Entry' | 'Asset'>).sys.linkType === 'Asset'
          ) {
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
      {}
    );
  }, [
    definition,
    node.data.props,
    node.data.blockId,
    node.children,
    resolveDesignValue,
    dataSource,
    areEntitiesFetched,
    unboundValues,
    node.type,
    entityStore,
  ]);

  const cfStyles = buildCfStyles(props);

  const editorWrapperProps = useMemo(() => {
    const wrapperProps = {
      isFixedWidth: false,
    };

    if (node.data.blockId !== CONTENTFUL_CONTAINER_ID) {
      return wrapperProps;
    }

    const width = props['cfWidth'];

    if (typeof width === 'number') {
      wrapperProps.isFixedWidth = true;
    }
    if (typeof width === 'string') {
      wrapperProps.isFixedWidth = !isNaN(Number(width.replace('px', '')));
    }

    return wrapperProps;
  }, [node, props]);

  const { className } = useStyleTag({ styles: cfStyles, nodeId: node.data.id });

  const renderDropZone = (node: CompositionComponentNode, props?: Record<string, unknown>) => {
    return (
      <DropZone
        sectionId={node.data.id}
        zoneId={node.data.id}
        node={node}
        resolveDesignValue={resolveDesignValue}
        {...props}
      />
    );
  };

  const defaultedProps = {
    className,
    editorMode: true,
    node,
    renderDropZone,
    'data-cf-node-id': node.data.id,
    'data-cf-node-block-id': node.data.blockId,
    'data-cf-node-block-type': node.type,
    // TODO: do we really need lodash just for this?
    ...omit(props, CF_STYLE_ATTRIBUTES, ['cfHyperlink', 'cfOpenInNewTab']),
  };

  return [defaultedProps, editorWrapperProps] as [typeof defaultedProps, typeof editorWrapperProps];
};
