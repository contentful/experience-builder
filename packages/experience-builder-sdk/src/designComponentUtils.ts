import { EntityStore } from '@contentful/visual-sdk';
import {
  CompositionNode,
  CompositionDataSource,
  CompositionUnboundValues,
  CompositionComponentNode,
  CompositionComponentPropValue,
  Composition,
} from './types';
import { generateRandomId } from './utils';
import { designComponentsRegistry } from './blocks/VisualEditorContext';

export const deserializeDesignComponentNode = ({
  node,
  parentId,
  compositionDataSource,
  compositionUnboundValues,
}: {
  node: CompositionNode;
  parentId?: string;
  compositionDataSource: CompositionDataSource;
  compositionUnboundValues: CompositionUnboundValues;
}): CompositionComponentNode => {
  const childNodeVariable: Record<string, CompositionComponentPropValue<'DesignValue'>> = {};
  const dataSource: CompositionDataSource = {};
  const unboundValues: CompositionUnboundValues = {};

  for (const [variableName, variable] of Object.entries(node.variables)) {
    if (variable.type === 'DesignValue') {
      childNodeVariable[variableName] = variable;
    } else if (variable.type === 'BoundValue') {
      const [, uuid, ,] = variable.path.split('/');

      dataSource[uuid] = { ...compositionDataSource[uuid] };
    } else if (variable.type === 'UnboundValue') {
      const uuid = variable.key;
      unboundValues[uuid] = compositionUnboundValues[uuid];
    }
  }

  const isDesignComponent = node.definitionId?.startsWith('DesignComponent');
  const nodeId = isDesignComponent ? node.definitionId?.split('-')[1] : generateRandomId(16);

  const children: CompositionComponentNode[] = node.children.map((child) =>
    deserializeDesignComponentNode({
      node: child,
      parentId: nodeId,
      compositionDataSource,
      compositionUnboundValues,
    })
  );

  return {
    // separate node type identifiers for design components and their blocks, so we can treat them differently in as much as we want
    type: isDesignComponent ? 'DesignComponent' : 'DesignComponentBlock',
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
  if (node.type !== 'DesignComponent') {
    return node;
  }

  const componentId = node.data.blockId?.split('-')[1] as string;
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
      children: componentFields.componentTree.children,
    },
    parentId: node.parentId,
    compositionDataSource: {},
    compositionUnboundValues: componentFields.unboundValues,
  });

  return deserializedNode;
};
