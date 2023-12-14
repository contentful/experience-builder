import React from 'react';
import { buildCfStyles, calculateNodeDefaultHeight } from '@/shared/utils/stylesUtils';
import { useEditorStore } from '@/store/editor';
import {
  CF_STYLE_ATTRIBUTES,
  CONTENTFUL_CONTAINER_ID,
  ComponentRegistration,
  CompositionComponentNode,
  CompositionVariableValueType,
  Link,
  StyleProps,
} from '@contentful/experience-builder-core';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStyleTag } from './useStyleTag';
import { omit } from 'lodash';
import { ResolveDesignValueType } from './useBreakpoints';
import { getUnboundValues } from '@/shared/utils/getUnboundValues';
import { transformContentValue } from '@/shared/utils/transformers';

import { DropZone } from '@components/DropZone/Dropzone';

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
  const { entityStore, unboundValues, dataSource } = useEditorStore(
    useShallow((state) => ({
      entityStore: state.entityStore,
      unboundValues: state.unboundValues,
      dataSource: state.dataSource,
    }))
  );

  const props: PropsType = useMemo(() => {
    if (!definition) {
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
          const valueByBreakpoint = resolveDesignValue(variableMapping.valuesByBreakpoint);
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
          // take value from the datasource for both bound and unbound value types
          const [, uuid, ...path] = variableMapping.path.split('/');
          const binding = dataSource[uuid] as Link<'Entry' | 'Asset'>;

          const boundValue = areEntitiesFetched
            ? entityStore?.getValue(binding, path.slice(0, -1))
            : undefined;
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
    entityStore,
    unboundValues,
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

  const renderDropZone = (node: CompositionComponentNode, props?: Record<string, any>) => {
    return (
      <DropZone
        sectionId={node.data.id}
        zoneId={node.data.id}
        node={node}
        resolveDesignValue={resolveDesignValue}
        areEntitiesFetched={areEntitiesFetched}
        {...props}
      />
    );
  };

  const defaultedProps = {
    className,
    editMode: true,
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
