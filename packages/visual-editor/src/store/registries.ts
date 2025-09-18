import type { ComponentRegistration } from '@contentful/experiences-core/types';

export const componentRegistry = new Map<string, ComponentRegistration>();

export const getComponentRegistration = (id: string) => componentRegistry.get(id);

export const addComponentRegistration = (componentRegistration: ComponentRegistration) => {
  componentRegistry.set(componentRegistration.definition.id, componentRegistration);
};
