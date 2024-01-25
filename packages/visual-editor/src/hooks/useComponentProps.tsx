import React from 'react';
import { useEditorStore } from '@/store/editor';
import {
  buildCfStyles,
  calculateNodeDefaultHeight,
  transformContentValue,
  isLinkToAsset,
} from '@contentful/experience-builder-core';
import {
  CF_STYLE_ATTRIBUTES,
  DESIGN_COMPONENT_NODE_TYPE,
  ASSEMBLY_NODE_TYPE,
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
import { omit } from 'lodash-es';
import { getUnboundValues } from '@/utils/getUnboundValues';
import { Dropzone } from '@components/Dropzone/Dropzone';
import { useEntityStore } from '@/store/entityStore';
import { isContentfulStructureComponent } from '@contentful/experience-builder-core';

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
  const { height, width, maxWidth } = cfStyles;

  // Create editor wrapper styles using the component height and width
  const editorStyles = {
    background: 'none',
    margin: isContentfulStructureComponent(node.data.blockId) ? '0 auto' : '0',
    height,
    width,
    maxWidth,
  };

  const { className: editorWrapperClass } = useStyleTag({
    styles: editorStyles,
    nodeId: `editor-${node.data.id}`,
  });

  // Set the component to be full width within the editor wrapper
  cfStyles.width = '100%';
  cfStyles.maxWidth = '100%';

  const { className } = useStyleTag({ styles: cfStyles, nodeId: node.data.id });

  const renderDropzone = (node: CompositionComponentNode, props?: Record<string, unknown>) => {
    return (
      <Dropzone
        sectionId={node.data.id}
        zoneId={node.data.id}
        node={node}
        resolveDesignValue={resolveDesignValue}
        {...props}
      />
    );
  };

  const componentProps = {
    className,
    editorMode: true,
    node,
    renderDropzone,
    'data-cf-node-id': node.data.id,
    'data-cf-node-block-id': node.data.blockId,
    'data-cf-node-block-type': node.type,
    ...omit(props, CF_STYLE_ATTRIBUTES, ['cfHyperlink', 'cfOpenInNewTab']),
    ...(definition.children ? { children: renderDropzone(node) } : {}),
  };

  return { props: componentProps, editorWrapperClass };
};
