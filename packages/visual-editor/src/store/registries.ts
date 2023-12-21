import type {
  ComponentRegistration,
  ComponentDefinition,
  Link,
} from '@contentful/experience-builder-core/types';

import {
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SECTION_ID,
} from '@contentful/experience-builder-core/constants';

export const designComponentsRegistry = new Map<string, Link<'Entry'>>([]);
export const setDesignComponents = (designComponents: Link<'Entry'>[]) => {
  for (const designComponent of designComponents) {
    designComponentsRegistry.set(designComponent.sys.id, designComponent);
  }
};

export const componentRegistry = new Map<string, ComponentRegistration>();

export const getComponentRegistration = (id: string) => {
  if (id === CONTENTFUL_SECTION_ID) {
    return componentRegistry.get(CONTENTFUL_CONTAINER_ID);
  }
  return componentRegistry.get(id);
};

export const addComponentRegistration = (componentRegistration: ComponentRegistration) => {
  componentRegistry.set(componentRegistration.definition.id, componentRegistration);
};

export const createDesignComponentRegistration = ({
  definitionId,
  definitionName,
  component,
}: {
  definitionId: string;
  definitionName?: string;
  component: ComponentRegistration['component'];
}) => {
  const componentRegistration = componentRegistry.get(definitionId);

  if (componentRegistration) {
    return componentRegistration;
  }

  const definition = {
    id: definitionId,
    name: definitionName || 'Design Component',
    variables: {} as ComponentDefinition['variables'],
    children: true,
    category: 'Design Components',
  };

  addComponentRegistration({ component, definition });

  return componentRegistry.get(definitionId);
};
