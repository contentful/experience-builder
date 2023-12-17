import { checkIfDesignComponent } from '@contentful/experience-builder-core';
import type { CompositionNode } from '@contentful/experience-builder-core/types';
import { EntityStore } from './EntityStore';

export const resolveDesignComponent = ({
  node,
  entityStore,
}: {
  node: CompositionNode;
  entityStore: EntityStore | undefined;
}) => {
  const isDesignComponent = checkIfDesignComponent({
    componentId: node.definitionId,
    usedComponents: entityStore?.usedComponents,
  });

  if (!isDesignComponent) {
    return node;
  }

  const componentId = node.definitionId as string;
  const designComponent = entityStore?.experienceEntryFields?.usedComponents?.find(
    (component) => component.sys.id === componentId
  );

  if (!designComponent) {
    return node;
  }

  if (!('fields' in designComponent)) {
    return node;
  }
  const componentFields = designComponent.fields;

  const deserializedNode = {
    ...node,
    children: componentFields.componentTree.children,
  };

  entityStore?.updateUnboundValues(componentFields.unboundValues);

  return deserializedNode;
};
