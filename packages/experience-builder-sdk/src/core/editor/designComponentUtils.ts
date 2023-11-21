import { EntityStore } from '@contentful/visual-sdk';
import {
  CompositionNode,
  CompositionDataSource,
  CompositionUnboundValues,
  CompositionComponentNode,
  CompositionComponentPropValue,
  Composition,
} from '../../types';
import { generateRandomId } from '../../utils/utils';
import { designComponentsRegistry } from '../../blocks/editor/VisualEditorContext';
import { DESIGN_COMPONENT_BLOCK_NODE_TYPE, DESIGN_COMPONENT_NODE_TYPE } from '../../constants';

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
  componentInstanceProps: CompositionComponentNode['data']['props'];
  componentInstanceUnboundValues: CompositionUnboundValues;
}): CompositionComponentNode => {
  const childNodeVariable: Record<string, CompositionComponentPropValue> = {};
  const dataSource: CompositionDataSource = {};
  const unboundValues: CompositionUnboundValues = {};

  for (const [variableName, variable] of Object.entries(node.variables)) {
    childNodeVariable[variableName] = variable;
    if (variable.type === 'BoundValue') {
      const [, uuid, ,] = variable.path.split('/');

      dataSource[uuid] = { ...designComponentDataSource[uuid] };
    } else if (variable.type === 'UnboundValue') {
      const uuid = variable.key;
      unboundValues[uuid] = designComponentUnboundValues[uuid];
    } else if (variable.type === 'ComponentValue') {
      const uuid = variable.key;
      // For design component, we are only handling binding for UnboundValues for now
      if (componentInstanceProps[uuid].type === 'UnboundValue') {
        unboundValues[uuid] = componentInstanceUnboundValues[componentInstanceProps[uuid]['key']];
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
    return node;
  }

  const componentFields = entityStore?.getValue(designComponent, [
    'fields',
  ]) as unknown as Composition;

  if (!componentFields) {
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
