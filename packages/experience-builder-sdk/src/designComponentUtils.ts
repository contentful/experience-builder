import { EntityStore } from '@contentful/visual-sdk';
import { Link } from './types';
import { defineComponents } from './core/componentRegistry';
import {
  CompositionNode,
  CompositionDataSource,
  CompositionUnboundValues,
  CompositionComponentNode,
  CompositionComponentPropValue,
  Composition,
  ComponentRegistration,
} from './types';
import { generateRandomId } from './utils';

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
  designComponents,
  entityStore,
}: {
  node: CompositionComponentNode;
  designComponents: Link<'Entry'>[];
  entityStore: EntityStore | null;
}) => {
  if (node.type !== 'DesignComponent') {
    return node;
  }

  const componentId = node.data.blockId?.split('-')[1] as string;
  const componentLink = designComponents?.find((link) => link.sys.id === componentId);

  if (!componentLink) {
    return node;
  }

  const componentFields = entityStore?.getValue(componentLink, [
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

export const getDesignComponentRegistration = ({
  component,
  designComponents,
  entityStore,
}: {
  component: ComponentRegistration['component'];
  designComponents: Link<'Entry'>[];
  entityStore: EntityStore | null;
}) => {
  const designComponentsDefinitions: ComponentRegistration[] = [];

  designComponents.forEach((link) => {
    const componentFields = entityStore?.getValue(link, ['fields']) as unknown as Composition;

    if (!componentFields) return;

    const definitionId = `DesignComponent-${link.sys.id}`;
    const definition = {
      id: definitionId,
      name: componentFields.title || 'Design Component',
      variables: {},
      children: true,
      category: 'Design Components',
    };
    designComponentsDefinitions.push({ component, definition });
  });

  defineComponents(designComponentsDefinitions);

  return designComponentsDefinitions;
};
