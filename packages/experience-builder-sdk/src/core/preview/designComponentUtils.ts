import { Composition, CompositionNode } from '../../types';
import { EntityStore } from '../EntityStore';
import { Entry } from 'contentful';

export const resolveDesignComponent = ({
  node,
  entityStore,
}: {
  node: CompositionNode;
  entityStore: EntityStore | undefined;
}) => {
  if (!node.definitionId.startsWith('DesignComponent')) {
    return node;
  }

  const componentId = node.definitionId?.split('-')[1] as string;
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
