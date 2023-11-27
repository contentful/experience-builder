import React, { RefObject, useCallback, useMemo } from 'react';

import type { EntityStore } from '@contentful/visual-sdk';
import omit from 'lodash.omit';

import { sendMessage } from '../../communication/sendMessage';
import {
  CF_STYLE_ATTRIBUTES,
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SECTION_ID,
  DESIGN_COMPONENT_NODE_TYPES,
} from '@contentful/experience-builder-core';

import { getUnboundValues } from '../../utils/getUnboundValues';
import { buildCfStyles, calculateNodeDefaultHeight } from '../../utils/stylesUtils';
import { ResolveDesignValueType } from '../../hooks/useBreakpoints';
import { useStyleTag } from '../../hooks/useStyleTag';
import {
  CompositionComponentNode,
  StyleProps,
  Link,
  CompositionVariableValueType,
  CompositionDataSource,
  CompositionUnboundValues,
} from '@contentful/experience-builder-core';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core';
import { ContentfulContainer } from '../editor-components/ContentfulContainer/ContentfulContainer';
// import { ImportedComponentErrorBoundary } from '../../components/ErrorBoundary';
import { transformContentValue } from '../../utils/transformers';
import { useEditorContext } from './useEditorContext';
import { ImportedComponentErrorBoundary } from '@components/ErrorBoundary';
// import { resolveDesignComponent } from '../../core/editor/designComponentUtils';

type PropsType =
  | StyleProps
  | Record<string, CompositionVariableValueType | Link<'Entry'> | Link<'Asset'>>;

type VisualEditorBlockProps = {
  node: CompositionComponentNode;

  dataSource: CompositionDataSource;
  unboundValues: CompositionUnboundValues;

  resolveDesignValue: ResolveDesignValueType;
  entityStore: RefObject<EntityStore>;
  areEntitiesFetched: boolean;
};

export const VisualEditorBlock = ({
  node: rawNode,
  dataSource,
  unboundValues,
  resolveDesignValue,
  entityStore,
  areEntitiesFetched,
}: VisualEditorBlockProps) => {
  const { setSelectedNodeId, componentRegistry } = useEditorContext();

  const node = useMemo(() => {
    // if (rawNode.type === DESIGN_COMPONENT_NODE_TYPE && areEntitiesFetched) {
    //   return resolveDesignComponent({
    //     node: rawNode,
    //     entityStore: entityStore.current,
    //   });
    // }

    return rawNode;
  }, [areEntitiesFetched, entityStore, rawNode]);

  const componentRegistration = useMemo(() => {
    // const registration = getComponentRegistration(node.data.blockId as string);

    const id = node.data.blockId as string;

    return componentRegistry[id];

    // if (node.type === DESIGN_COMPONENT_NODE_TYPE && !registration) {
    //   return createDesignComponentRegistration({
    //     definitionId: node.data.blockId as string,
    //     component: DesignComponent,
    //   });
    // }
  }, [node]);

  const props: PropsType = useMemo(() => {
    if (!componentRegistration) {
      return {};
    }

    return Object.entries(componentRegistration.definition.variables).reduce(
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
            ? entityStore.current?.getValue(binding, path.slice(0, -1))
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
    componentRegistration,
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
  const { className } = useStyleTag({ styles: cfStyles, nodeId: node.data.id });

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.stopPropagation();
      e.preventDefault();

      // if (node.type === DESIGN_COMPONENT_BLOCK_NODE_TYPE) {
      //   // If a design component block is clicked, find the parent design component and select it
      //   const designComponentElement = e.currentTarget.closest(
      //     '[data-cf-node-block-type="designComponent"]'
      //   );
      //   const designComponentNodeId = designComponentElement?.getAttribute('data-cf-node-id');

      //   if (!designComponentNodeId) return;

      //   setSelectedNodeId(designComponentNodeId);
      //   sendMessage(OUTGOING_EVENTS.ComponentSelected, {
      //     nodeId: designComponentNodeId,
      //   });

      //   return;
      // }

      setSelectedNodeId(node.data.id);
      sendMessage(OUTGOING_EVENTS.ComponentSelected, {
        nodeId: node.data.id,
      });
    },
    [node, setSelectedNodeId]
  );

  if (!componentRegistration) {
    return null;
  }

  const { component, definition } = componentRegistration;

  const children =
    definition.children === true
      ? node.children.map((childNode) => {
          // if parent is a design component, only render children belonging to the design component
          if (
            DESIGN_COMPONENT_NODE_TYPES.includes(node.type) &&
            !DESIGN_COMPONENT_NODE_TYPES.includes(childNode.type)
          )
            return null;
          return (
            <VisualEditorBlock
              node={childNode}
              key={childNode.data.id}
              dataSource={dataSource}
              unboundValues={unboundValues}
              resolveDesignValue={resolveDesignValue}
              entityStore={entityStore}
              areEntitiesFetched={areEntitiesFetched}
            />
          );
        })
      : null;

  // remove CONTENTFUL_SECTION_ID when all customers are using 2023-09-28 schema version
  if ([CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID].includes(definition.id)) {
    return (
      <ContentfulContainer
        className={className}
        editorMode={true}
        key={node.data.id}
        node={node}
        onMouseDown={onMouseDown}
        // something is off with conditional types and eslint can't recognize it

        cfHyperlink={(props as StyleProps).cfHyperlink}
        cfOpenInNewTab={(props as StyleProps).cfOpenInNewTab}>
        {children}
      </ContentfulContainer>
    );
  }

  const importedComponent = React.createElement(
    component,
    {
      onMouseDown,
      onClick: (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
      },
      'data-cf-node-id': node.data.id,
      'data-cf-node-block-id': node.data.blockId,
      'data-cf-node-block-type': node.type,
      className,
      // TODO: do we really need lodash just for this?
      ...omit(props, CF_STYLE_ATTRIBUTES, ['cfHyperlink', 'cfOpenInNewTab']),
    },
    children
  );

  return <ImportedComponentErrorBoundary>{importedComponent}</ImportedComponentErrorBoundary>;
};
