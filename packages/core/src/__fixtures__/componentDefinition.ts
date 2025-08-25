import { ComponentDefinition } from '@/types';

export const createComponentDefinition = (
  overrides?: Partial<ComponentDefinition>,
): ComponentDefinition => ({
  id: 'test-component',
  name: 'TestComponent',
  builtInStyles: [],
  variables: {
    isChecked: {
      type: 'Boolean',
    },
  },
  ...overrides,
});
