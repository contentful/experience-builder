import { EntityStore } from '@contentful/visual-sdk';
import {
  CompositionNode,
  CompositionDataSource,
  CompositionUnboundValues,
  CompositionComponentNode,
  CompositionComponentPropValue,
  Composition,
} from '../../types';
import { designComponentsRegistry } from '../../blocks/editor/VisualEditorContext';
import { DESIGN_COMPONENT_BLOCK_NODE_TYPE, DESIGN_COMPONENT_NODE_TYPE } from '../../constants';
import { generateRandomId } from '@contentful/experience-builder-core';

export const deserializeDesignComponentNode = ({
  node,
  nodeId,
  parentId,
  designComponentDataSource,
  designComponentUnboundValues,
  componentInstanceProps,
  componentInstanceUnboundValues,
}: {
  node: CompositionNode;
  nodeId: string;
  parentId?: string;
  designComponentDataSource: CompositionDataSource;
  designComponentUnboundValues: CompositionUnboundValues;
  componentInstanceProps: Record<string, CompositionComponentPropValue>;
  componentInstanceUnboundValues: CompositionUnboundValues;
}): CompositionComponentNode => {
  const childNodeVariable: Record<string, CompositionComponentPropValue> = {};
  const dataSource: CompositionDataSource = {};
  const unboundValues: CompositionUnboundValues = {};

  for (const [variableName, variable] of Object.entries(node.variables)) {
    childNodeVariable[variableName] = variable;
    if (variable.type === 'ComponentValue') {
      const uuid = variable.key;
      const variableMapping = componentInstanceProps[uuid];

      // For design component, we are only handling binding for UnboundValues for now
      if (variableMapping?.type === 'UnboundValue') {
        const componentInstanceValue = componentInstanceUnboundValues[variableMapping.key].value;

        if (typeof componentInstanceValue === 'object' && componentInstanceValue !== null) {
          unboundValues[uuid] = designComponentUnboundValues[componentInstanceValue['key']];
        } else {
          unboundValues[uuid] = componentInstanceUnboundValues[variableMapping.key];
        }
      }
    }
  }

  const isDesignComponent = designComponentsRegistry.has(node.definitionId);

  const children: CompositionComponentNode[] = node.children.map((child) =>
    deserializeDesignComponentNode({
      node: child,
      nodeId: generateRandomId(16),
      parentId: nodeId,
      designComponentDataSource,
      designComponentUnboundValues,
      componentInstanceProps,
      componentInstanceUnboundValues,
    })
  );

  return {
    // separate node type identifiers for design components and their blocks, so we can treat them differently in as much as we want
    type: isDesignComponent ? DESIGN_COMPONENT_NODE_TYPE : DESIGN_COMPONENT_BLOCK_NODE_TYPE,
    parentId,
    data: {
      id: nodeId,
      blockId: node.definitionId,
      props: childNodeVariable,
      dataSource,
      unboundValues,
      breakpoints: [],
    },
    children,
  };
};

export const resolveDesignComponent = ({
  node,
  entityStore,
}: {
  node: CompositionComponentNode;
  entityStore: EntityStore | null;
}) => {
  if (node.type !== DESIGN_COMPONENT_NODE_TYPE) {
    return node;
  }

  const componentId = node.data.blockId as string;
  const designComponent = designComponentsRegistry.get(componentId);

  if (!designComponent) {
    console.warn(`Link to design component with ID '${componentId}' not found`);
    return node;
  }

  const componentFields = entityStore?.getValue(designComponent, [
    'fields',
  ]) as unknown as Composition;

  if (!componentFields) {
    console.warn(`Entry for design component with ID '${componentId}' not found`);
    return node;
  }

  const deserializedNode = deserializeDesignComponentNode({
    node: {
      definitionId: node.data.blockId || '',
      variables: {},
      children: componentFields.componentTree?.children ?? [],
    },
    nodeId: node.data.id,
    parentId: node.parentId,
    designComponentDataSource: {},
    designComponentUnboundValues: componentFields.unboundValues,
    componentInstanceProps: node.data.props,
    componentInstanceUnboundValues: node.data.unboundValues,
  });

  return deserializedNode;
};
