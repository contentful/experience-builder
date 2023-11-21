import { Composition, CompositionNode, ExperienceEntry } from '../../types';
import { checkIfDesignComponent } from '../../utils/utils';
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

  const componentFields = (designComponent as ExperienceEntry).fields as unknown as Composition;
  if (!componentFields) {
    return node;
  }

  const deserializedNode = {
    ...node,
    children: componentFields.componentTree.children,
  };

  entityStore?.updateUnboundValues(componentFields.unboundValues);

  return deserializedNode;
};
