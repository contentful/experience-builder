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
  componentInstanceDataSource,
}: {
  node: CompositionNode;
  nodeId: string;
  parentId?: string;
  designComponentDataSource: CompositionDataSource;
  designComponentUnboundValues: CompositionUnboundValues;
  componentInstanceProps: Record<string, CompositionComponentPropValue>;
  componentInstanceUnboundValues: CompositionUnboundValues;
  componentInstanceDataSource: CompositionDataSource;
}): CompositionComponentNode => {
  const childNodeVariable: Record<string, CompositionComponentPropValue> = {};
  const dataSource: CompositionDataSource = {};
  const unboundValues: CompositionUnboundValues = {};

  for (const [variableName, variable] of Object.entries(node.variables)) {
    childNodeVariable[variableName] = variable;
    if (variable.type === 'ComponentValue') {
      const componentValueKey = variable.key;
      const instanceProperty = componentInstanceProps[componentValueKey];

      // For design component, we look up the value in the design component instance and
      // replace the componentValue with that one.
      if (instanceProperty?.type === 'UnboundValue') {
        const componentInstanceValue = componentInstanceUnboundValues[instanceProperty.key];
        unboundValues[instanceProperty.key] = componentInstanceValue;
        childNodeVariable[variableName] = {
          type: 'UnboundValue',
          key: instanceProperty.key,
        };
      } else if (instanceProperty?.type === 'BoundValue') {
        const [, dataSourceKey] = instanceProperty.path.split('/');
        const componentInstanceValue = componentInstanceDataSource[dataSourceKey];
        dataSource[dataSourceKey] = componentInstanceValue;
        childNodeVariable[variableName] = {
          type: 'BoundValue',
          path: instanceProperty.path,
        };
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
      componentInstanceDataSource,
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
    console.warn(`Link to design component with ID '${componentId}' not found`, {
      designComponentsRegistry,
    });
    return node;
  }

  const componentFields = entityStore?.getValue(designComponent, [
    'fields',
  ]) as unknown as Composition;

  if (!componentFields) {
    console.warn(`Entry for design component with ID '${componentId}' not found`, { entityStore });
    return node;
  }

  if (!componentFields.componentTree?.children) {
    console.warn(`Component tree for design component with ID '${componentId}' not found`, {
      componentFields,
    });
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
    componentInstanceDataSource: node.data.dataSource,
  });

  return deserializedNode;
};
