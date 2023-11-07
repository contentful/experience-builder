import { EntityStore } from '@contentful/visual-sdk';
import {
  CompositionNode,
  CompositionDataSource,
  CompositionUnboundValues,
  CompositionComponentNode,
  CompositionComponentPropValue,
  Composition,
} from '../../types';
import { generateRandomId } from '../../utils';
import { designComponentsRegistry } from '../../blocks/VisualEditorContext';

export const deserializeDesignComponentNode = ({
  node,
  nodeId,
  parentId,
  experienceDataSource,
  experiencenUnboundValues,
}: {
  node: CompositionNode;
  nodeId: string;
  parentId?: string;
  experienceDataSource: CompositionDataSource;
  experiencenUnboundValues: CompositionUnboundValues;
}): CompositionComponentNode => {
  const childNodeVariable: Record<string, CompositionComponentPropValue<'DesignValue'>> = {};
  const dataSource: CompositionDataSource = {};
  const unboundValues: CompositionUnboundValues = {};

  for (const [variableName, variable] of Object.entries(node.variables)) {
    if (variable.type === 'DesignValue') {
      childNodeVariable[variableName] = variable;
    } else if (variable.type === 'BoundValue') {
      const [, uuid, ,] = variable.path.split('/');

      dataSource[uuid] = { ...experienceDataSource[uuid] };
    } else if (variable.type === 'UnboundValue') {
      const uuid = variable.key;
      unboundValues[uuid] = experiencenUnboundValues[uuid];
    }
  }

  const isDesignComponent = designComponentsRegistry.has(node.definitionId);

  const children: CompositionComponentNode[] = node.children.map((child) =>
    deserializeDesignComponentNode({
      node: child,
      nodeId: generateRandomId(16),
      parentId: nodeId,
      experienceDataSource,
      experiencenUnboundValues,
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
      children: componentFields.componentTree.children,
    },
    nodeId: node.data.id,
    parentId: node.parentId,
    experienceDataSource: {},
    experiencenUnboundValues: componentFields.unboundValues,
  });

  return deserializedNode;
};
