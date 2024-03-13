import type {
  ComponentRegistration,
  ComponentDefinition,
  Link,
} from '@contentful/experiences-core/types';

import { PATTERN_DEFAULT_CATEGORY } from '@contentful/experiences-core/constants';

// Note: During development, the hot reloading might empty this and it
// stays empty leading to not rendering patterns. Ideally, this is
// integrated into the state machine to keep track of its state.
export const patternsRegistry = new Map<string, Link<'Entry'>>([]);
export const setPatterns = (patterns: Link<'Entry'>[]) => {
  for (const pattern of patterns) {
    patternsRegistry.set(pattern.sys.id, pattern);
  }
};

export const componentRegistry = new Map<string, ComponentRegistration>();

export const getComponentRegistration = (id: string) => componentRegistry.get(id);

export const addComponentRegistration = (componentRegistration: ComponentRegistration) => {
  componentRegistry.set(componentRegistration.definition.id, componentRegistration);
};

export const createPatternRegistration = ({
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
    name: definitionName || 'Component',
    variables: {} as ComponentDefinition['variables'],
    children: true,
    category: PATTERN_DEFAULT_CATEGORY,
  };

  addComponentRegistration({ component, definition });

  return componentRegistry.get(definitionId);
};
