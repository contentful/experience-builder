import { validateComponentDefinition, validateExperienceFields } from '../src/validators';
import { componentDefinition } from './__fixtures__/componentDefinition';
import { experience } from './__fixtures__/v2023_09_28/experience';
import { describe, it, expect } from 'vitest';

describe('validateExperienceFields', () => {
  it('should return an error if schemaVersion is unsupported', () => {
    //@ts-expect-error - Testing invalid version
    const result = validateExperienceFields(experience, 'invalid-version');

    expect(result.success).toBe(false);
    expect(result.errors?.[0].name).toBe('in');
    expect(result.errors?.[0].expected).toEqual(['2023-09-28']);
    expect(result.errors?.[0].details).toBe('Unsupported schema version');
  });

  it('should validate the experience successfully', () => {
    const result = validateExperienceFields(experience, '2023-09-28');

    expect(result.success).toBe(true);
  });
});

describe('validateComponentDefinition', () => {
  it('should validate the component definition successfully', () => {
    const result = validateComponentDefinition(componentDefinition);

    expect(result.success).toBe(true);
  });

  it('should return an error if component definition id is longer than max length', () => {
    const unpdatedComponentDefinition = {
      ...componentDefinition,
      id: componentDefinition.id.repeat(10),
    };

    const result = validateComponentDefinition(unpdatedComponentDefinition);

    expect(result.success).toBe(false);
    expect(result.errors?.[0].name).toBe('regex');
    expect(result.errors?.[0].path).toEqual(['id']);
    expect(result.errors?.[0].details).toBe('Property needs to match: /^[a-zA-Z0-9-_]{1,32}$/');
  });

  it('should return an error if component variable key is longer than max length', () => {
    const unpdatedComponentDefinition = {
      ...componentDefinition,
      variables: {
        ['testVar'.repeat(10)]: {
          type: 'Boolean',
        },
      },
    };

    const result = validateComponentDefinition(unpdatedComponentDefinition);

    expect(result.success).toBe(false);
    expect(result.errors?.[0].name).toBe('regex');
    expect(result.errors?.[0].path).toEqual(['variables', 'testVar'.repeat(10)]);
    expect(result.errors?.[0].details).toBe('Property needs to match: /^[a-zA-Z0-9-_]{1,32}$/');
  });

  it('should return an error if component variable key is longer than max length', () => {
    const unpdatedComponentDefinition = {
      ...componentDefinition,
      variables: {
        testVar: {
          type: 'InvalidType',
        },
      },
    };

    const result = validateComponentDefinition(unpdatedComponentDefinition);

    expect(result.success).toBe(false);
    expect(result.errors?.[0].name).toBe('in');
    expect(result.errors?.[0].path).toEqual(['variables', 'testVar', 'type']);
    expect(result.errors?.[0].expected).toEqual([
      'Text',
      'RichText',
      'Number',
      'Date',
      'Boolean',
      'Location',
      'Media',
      'Object',
      'Hyperlink',
      'Array',
      'Link',
    ]);
  });
});
