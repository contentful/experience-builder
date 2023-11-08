import { Composition, CompositionNode } from '../../types';
import { checkIfDesignComponent } from '../../utils';
import { EntityStore } from '../EntityStore';
import { Entry } from 'contentful';

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

  const componentFields = (designComponent as Entry).fields as unknown as Composition;

  const deserializedNode = {
    ...node,
    children: componentFields.componentTree.children,
  };

  entityStore?.updateUnboundValues(componentFields.unboundValues);

  return deserializedNode;
};
