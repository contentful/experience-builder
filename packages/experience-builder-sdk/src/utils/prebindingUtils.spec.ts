import { shouldUsePrebinding, resolvePrebindingPath } from './prebindingUtils';
import { EntityStore } from '@contentful/experiences-core';
import {
  ComponentPropertyValue,
  ExperienceComponentSettings,
  PatternProperty,
} from '@contentful/experiences-validators';

describe('shouldUsePrebinding', () => {
  it('should return true when all conditions are met', () => {
    const componentValueKey = 'testKey';
    const componentSettings = {
      patternPropertyDefinitions: {
        testPatternPropertyDefinitionId: {},
      },
      variableMappings: {
        testKey: {
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties = {
      testPatternPropertyDefinitionId: {},
    } as unknown as Record<string, PatternProperty>;
    const variable = {
      type: 'NoValue',
    } as unknown as ComponentPropertyValue;

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      patternProperties,
      variable,
    });

    expect(result).toBe(true);
  });

  it('should return false when patternPropertyDefinition is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings = {
      patternPropertyDefinitions: {},
      variableMappings: {
        testKey: {
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {
      testPatternPropertyDefinitionId: {},
    } as unknown as Record<string, PatternProperty>;
    const variable = {
      type: 'NoValue',
    } as unknown as ComponentPropertyValue;

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      patternProperties,
      variable,
    });

    expect(result).toBe(false);
  });

  it('should return false when patternProperty is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      patternPropertyDefinitions: {
        testPatternPropertyDefinitionId: {},
      },
      variableMappings: {
        testKey: {
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {};
    const variable = {
      type: 'NoValue',
    } as unknown as ComponentPropertyValue;

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      patternProperties,
      variable,
    });

    expect(result).toBe(false);
  });

  it('should return false when variableMapping is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings = {
      patternPropertyDefinitions: {
        testPatternPropertyDefinitionId: {},
      },
      variableMappings: {},
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {
      testPatternPropertyDefinitionId: { path: '/entries/testEntry', type: 'BoundValue' },
    };
    const variable = {
      type: 'NoValue',
    } as unknown as ComponentPropertyValue;

    const result = shouldUsePrebinding({
      componentValueKey,
      componentSettings,
      patternProperties,
      variable,
    });

    expect(result).toBe(false);
  });
});

describe('resolvePrebindingPath', () => {
  it('should return the correct path when all conditions are met', () => {
    const componentValueKey = 'testKey';
    const componentSettings = {
      patternPropertyDefinitions: {},
      variableDefinitions: {},
      variableMappings: {
        testKey: {
          type: 'ContentTypeMapping',
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
          pathsByContentType: {
            testContentType: { path: '/fields/testField' },
          },
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {
      testPatternPropertyDefinitionId: { path: '/entries/testEntry', type: 'BoundValue' },
    };
    const entityStore = {
      dataSource: {
        testEntry: { sys: { type: 'Entry', contentType: { sys: { id: 'testContentType' } } } },
      },
      getEntryOrAsset: jest.fn().mockReturnValue({
        sys: { type: 'Entry', contentType: { sys: { id: 'testContentType' } } },
      }),
    } as unknown as EntityStore;

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      patternProperties,
      entityStore,
    });

    expect(result).toBe('/entries/testEntry/fields/testField');
  });

  it('should return an empty string when variableMapping is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {},
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {};
    const entityStore: EntityStore = {
      dataSource: {},
      getEntryOrAsset: jest.fn(),
    } as unknown as EntityStore;

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      patternProperties,
      entityStore,
    });

    expect(result).toBe('');
  });

  it('should return an empty string when patternProperties is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {
        testKey: {
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {};
    const entityStore: EntityStore = {
      dataSource: {},
      getEntryOrAsset: jest.fn(),
    } as unknown as EntityStore;

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      patternProperties,
      entityStore,
    });

    expect(result).toBe('');
  });

  it('should return an empty string when entityOrAsset is not an Entry', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {
        testKey: {
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {
      testPatternPropertyDefinitionId: { path: '/entries/testEntry' },
    } as unknown as Record<string, PatternProperty>;
    const entityStore: EntityStore = {
      dataSource: {
        testEntry: { sys: { type: 'Asset' } },
      },
      getEntryOrAsset: jest.fn().mockReturnValue({ sys: { type: 'Asset' } }),
    } as unknown as EntityStore;

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      patternProperties,
      entityStore,
    });

    expect(result).toBe('');
  });

  it('should return an empty string when fieldPath is missing', () => {
    const componentValueKey = 'testKey';
    const componentSettings: ExperienceComponentSettings = {
      variableMappings: {
        testKey: {
          patternPropertyDefinitionId: 'testPatternPropertyDefinitionId',
          pathsByContentType: {},
        },
      },
    } as unknown as ExperienceComponentSettings;
    const patternProperties: Record<string, PatternProperty> = {
      testPatternPropertyDefinitionId: { path: '/entries/testEntry' },
    } as unknown as Record<string, PatternProperty>;
    const entityStore: EntityStore = {
      dataSource: {
        testEntry: { sys: { type: 'Entry', contentType: { sys: { id: 'testContentType' } } } },
      },
      getEntryOrAsset: jest.fn().mockReturnValue({
        sys: { type: 'Entry', contentType: { sys: { id: 'testContentType' } } },
      }),
    } as unknown as EntityStore;

    const result = resolvePrebindingPath({
      componentValueKey,
      componentSettings,
      patternProperties,
      entityStore,
    });

    expect(result).toBe('');
  });
});
