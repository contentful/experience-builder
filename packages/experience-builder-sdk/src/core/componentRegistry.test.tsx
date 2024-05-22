import React from 'react';
import {
  containerDefinition,
  defineBreakpoints,
  sectionDefinition,
} from '@contentful/experiences-core';
import {
  INTERNAL_EVENTS,
  CONTENTFUL_COMPONENTS,
  ASSEMBLY_DEFAULT_CATEGORY,
  OUTGOING_EVENTS,
} from '@contentful/experiences-core/constants';
import * as registry from './componentRegistry';
import type { ComponentRegistration } from '@contentful/experiences-core/types';
import { SDK_VERSION } from '../sdkVersion';

const TestComponent = () => {
  return <div data-test-id="test">Test</div>;
};

describe('component registration', () => {
  afterEach(() => {
    registry.resetComponentRegistry();
  });

  describe('getComponentRegistration', () => {
    it('should return undefined if requested id is not registered', () => {
      expect(registry.getComponentRegistration('random-str')).toBe(undefined);
    });

    it('should return container when given a container id', () => {
      expect(
        registry.getComponentRegistration(CONTENTFUL_COMPONENTS.container.id)?.definition,
      ).toEqual(containerDefinition);
    });

    it('should return section when given a section id', () => {
      expect(
        registry.getComponentRegistration(CONTENTFUL_COMPONENTS.section.id)?.definition,
      ).toEqual(sectionDefinition);
    });
  });

  describe('defineComponents', () => {
    it('should emit the registered components event', () => {
      jest.spyOn(window, 'dispatchEvent');

      const definitionId = 'TestComponent';

      registry.defineComponents([
        {
          component: TestComponent,
          definition: {
            id: definitionId,
            name: 'TestComponent',
            builtInStyles: [],
            variables: {
              isChecked: {
                type: 'Boolean',
              },
            },
          },
        },
      ]);

      const componentRegistration = registry.getComponentRegistration(definitionId);
      expect(componentRegistration).toBeDefined();
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        new CustomEvent(INTERNAL_EVENTS.ComponentsRegistered),
      );
    });

    it('should apply fallback to group: content for variables that have it undefined', () => {
      const definitionId = 'TestComponent';

      registry.defineComponents([
        {
          component: TestComponent,
          definition: {
            id: definitionId,
            name: 'TestComponent',
            builtInStyles: [],
            variables: {
              isChecked: {
                type: 'Boolean',
              },
            },
          },
        },
      ]);

      const componentRegistration = registry.getComponentRegistration(definitionId);
      expect(componentRegistration).toBeDefined();
      expect(componentRegistration!.definition.variables.isChecked.group).toBe('content');
    });

    it('should add default built-in style variables', () => {
      const definitionId = 'TestComponent-1';

      registry.defineComponents([
        {
          component: TestComponent,
          definition: {
            id: definitionId,
            name: 'TestComponent',
            variables: {
              isChecked: {
                type: 'Boolean',
              },
            },
          },
        },
      ]);

      const componentRegistration = registry.getComponentRegistration(definitionId);
      expect(componentRegistration).toBeDefined();

      const variableKeys = Object.keys(componentRegistration!.definition.variables);
      expect(variableKeys).toContain('cfMargin');
    });

    it('should add specified built-in style variables', () => {
      const definitionId = 'TestComponent-2';

      registry.defineComponents([
        {
          component: TestComponent,
          definition: {
            id: definitionId,
            name: 'TestComponent',
            builtInStyles: ['cfPadding', 'cfBorder'],
            variables: {
              isChecked: {
                type: 'Boolean',
              },
            },
          },
        },
      ]);

      const componentRegistration = registry.getComponentRegistration(definitionId);
      expect(componentRegistration).toBeDefined();

      const variableKeys = Object.keys(componentRegistration!.definition.variables);
      expect(variableKeys).toContain('cfPadding');
      expect(variableKeys).toContain('cfBorder');
      expect(variableKeys).not.toContain('cfMargin');
    });

    it('should apply fallback to group: content for variables that have it undefined', () => {
      const definitionId = 'TestComponent';

      registry.defineComponents([
        {
          component: TestComponent,
          definition: {
            id: definitionId,
            name: 'TestComponent',
            builtInStyles: [],
            variables: {
              isChecked: {
                type: 'Boolean',
              },
            },
          },
        },
      ]);

      const definition = registry.getComponentRegistration(definitionId);
      expect(definition).toBeDefined();

      for (const variable of Object.values(definition!.definition.variables)) {
        expect(variable.group).toBe('content');
      }
    });
  });
});

describe('createAssemblyRegistration', () => {
  let existingComponentRegistration: ComponentRegistration;
  beforeEach(() => {
    existingComponentRegistration = {
      component: jest.fn(),
      definition: {
        id: 'existing-definition-id',
        name: 'Existing Definition',
        variables: {},
        children: true,
        category: ASSEMBLY_DEFAULT_CATEGORY,
      },
    };
    registry.addComponentRegistration(existingComponentRegistration);
  });

  afterEach(() => {
    registry.resetComponentRegistry();
    jest.restoreAllMocks();
  });

  it('should return an existing component registration object if one already exists with the given definition ID', () => {
    const definitionId = 'existing-definition-id';
    const component = jest.fn();
    const addComponentRegistrationMock = jest.spyOn(registry, 'addComponentRegistration');

    const result = registry.createAssemblyRegistration({ definitionId, component });

    expect(result).toBe(existingComponentRegistration);
    expect(addComponentRegistrationMock).not.toHaveBeenCalled();
  });

  it('should add a new component registration to the component registry', () => {
    const definitionId = '123';
    const component = jest.fn();
    const addComponentRegistrationMock = jest.spyOn(registry, 'addComponentRegistration');

    const result = registry.createAssemblyRegistration({ definitionId, component });

    expect(result).toEqual({
      component,
      definition: {
        id: definitionId,
        name: 'Component',
        variables: {},
        children: true,
        category: ASSEMBLY_DEFAULT_CATEGORY,
      },
    });
    expect(addComponentRegistrationMock).toHaveBeenCalled();
  });
  describe('runRegisteredComponentValidations', () => {
    let existingComponentRegistration: ComponentRegistration;
    beforeEach(() => {
      existingComponentRegistration = {
        component: jest.fn(),
        definition: {
          id: 'existing-definition-id',
          name: 'Existing Definition',
          variables: {},
          children: true,
          category: ASSEMBLY_DEFAULT_CATEGORY,
        },
      };
      registry.addComponentRegistration(existingComponentRegistration);
    });

    afterEach(() => {
      registry.resetComponentRegistry();
      jest.restoreAllMocks();
    });

    it('throws and error if component definition is invalid', () => {
      const invalidComponentRegistration = {
        component: jest.fn(),
        definition: {
          id: 'definition-id'.repeat(10),
          name: 'Invalid Component',
          variables: {},
          children: true,
          category: ASSEMBLY_DEFAULT_CATEGORY,
        },
      };
      registry.addComponentRegistration(invalidComponentRegistration);
      const errors = [
        {
          details: 'Property needs to match: /^[a-zA-Z0-9-_]{1,32}$/',
          name: 'regex',
          path: ['id'],
        },
      ];
      const error = new Error(
        `Invalid component definition for component 'Invalid Component'. Failed with errors: \n${JSON.stringify(errors, null, 2)}`,
      );
      expect(() => registry.runRegisteredComponentValidations()).toThrow(error);
    });
    it('does not throw an error if no component definition is invalid', () => {
      expect(() => registry.runRegisteredComponentValidations()).not.toThrow(new Error());
    });
  });
});

describe('sendRegisteredComponentsMessage', () => {
  beforeEach(() => {
    jest.spyOn(window, 'postMessage');
    jest.spyOn(window, 'dispatchEvent');
  });

  afterEach(() => {
    registry.resetComponentRegistry();
  });

  it('should only send component definitions', () => {
    registry.sendRegisteredComponentsMessage();

    expect(window.postMessage).toHaveBeenCalledWith(
      {
        source: 'customer-app',
        eventType: OUTGOING_EVENTS.RegisteredComponents,
        payload: {
          definitions: Array.from(registry.componentRegistry.values()).map(
            (registration) => registration.definition,
          ),
        },
      },
      '*',
    );

    const definitionId = 'TestComponent';
    registry.defineComponents([
      {
        component: TestComponent,
        definition: {
          id: definitionId,
          name: 'TestComponent',
          builtInStyles: [],
          variables: {
            isChecked: {
              type: 'Boolean',
            },
          },
        },
      },
    ]);

    registry.sendRegisteredComponentsMessage();

    expect(window.postMessage).toHaveBeenCalledWith(
      {
        source: 'customer-app',
        eventType: OUTGOING_EVENTS.RegisteredComponents,
        payload: {
          definitions: Array.from(registry.componentRegistry.values()).map(
            (registration) => registration.definition,
          ),
        },
      },
      '*',
    );

    for (const call of (window.postMessage as jest.Mock).mock.calls) {
      for (const definition of call[0].payload.definitions) {
        expect(definition).not.toHaveProperty('component');
      }
    }
  });
});

describe('sendConnectedEventWithRegisteredComponents', () => {
  beforeEach(() => {
    jest.spyOn(window, 'postMessage');
    jest.spyOn(window, 'dispatchEvent');
  });

  afterEach(() => {
    registry.resetComponentRegistry();
  });

  it('should only send component definitions', () => {
    const definitionId = 'TestComponent';
    registry.defineComponents([
      {
        component: TestComponent,
        definition: {
          id: definitionId,
          name: 'TestComponent',
          builtInStyles: [],
          variables: {
            isChecked: {
              type: 'Boolean',
            },
          },
        },
      },
    ]);

    const customBreakpoints = [
      {
        id: 'test-desktop',
        query: '*',
        displayName: 'All Sizes',
        previewSize: '100%',
      },
      {
        id: 'test-tablet',
        query: '<982px',
        displayName: 'Tablet',
        previewSize: '820px',
      },
      {
        id: 'test-mobile',
        query: '<576px',
        displayName: 'Mobile',
        previewSize: '390px',
      },
    ];

    defineBreakpoints(customBreakpoints);

    registry.sendConnectedEventWithRegisteredComponents();

    expect(window.postMessage).toHaveBeenNthCalledWith(
      1,
      {
        source: 'customer-app',
        eventType: OUTGOING_EVENTS.Connected,
        payload: {
          sdkVersion: SDK_VERSION,
          definitions: Array.from(registry.componentRegistry.values()).map(
            (registration) => registration.definition,
          ),
        },
      },
      '*',
    );

    expect(window.postMessage).toHaveBeenNthCalledWith(
      2,
      {
        source: 'customer-app',
        eventType: OUTGOING_EVENTS.RegisteredBreakpoints,
        payload: {
          breakpoints: customBreakpoints,
        },
      },
      '*',
    );

    expect(window.postMessage).toHaveBeenNthCalledWith(
      3,
      {
        source: 'customer-app',
        eventType: OUTGOING_EVENTS.DesignTokens,
        payload: {
          designTokens: {},
          resolvedCssVariables: {},
        },
      },
      '*',
    );
  });
});
