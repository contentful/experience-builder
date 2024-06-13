import { validateBreakpointsDefinition, validateExperienceFields } from '../../src/validators';
import { experience, experiencePattern } from '../__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';

const schemaVersion = '2023-09-28' as const;

describe(`${schemaVersion} version`, () => {
  const requiredFields = ['componentTree', 'dataSource', 'unboundValues'] as const;

  it.each(requiredFields)('should return an error if "%s" field is missing', (field) => {
    const { [field]: _, ...rest } = experience.fields;
    const updatedExperience = { ...experience, fields: rest };
    const result = validateExperienceFields(updatedExperience, schemaVersion);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.name).toBe('required');
    expect(error?.details).toBe(`The property "${field}" is required here`);
  });

  it('should validate the experience successfully', () => {
    const result = validateExperienceFields(experience, schemaVersion);

    expect(result.success).toBe(true);
  });

  it('should validate the pattern successfully', () => {
    const result = validateExperienceFields(experiencePattern, schemaVersion);

    expect(result.success).toBe(true);
  });

  it('should read the schema version from the componentTree if no override is provided', () => {
    const result = validateExperienceFields(experiencePattern);

    expect(result.success).toBe(true);
  });
});

describe(validateBreakpointsDefinition, () => {
  it('should validate that query is "<" px value', () => {
    const breakpoints = [
      {
        id: 'test-desktop',
        query: '*',
        displayName: 'All Sizes',
        previewSize: '100%',
      },
      {
        id: 'test-tablet',
        query: '>982px',
        displayName: 'Tablet',
        previewSize: '820px',
      },
    ];
    const result = validateBreakpointsDefinition(breakpoints);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should validate that first breakpoint has a wild card query', () => {
    const breakpoints = [
      {
        id: 'test-desktop',
        query: '<1000px',
        displayName: 'All Sizes',
        previewSize: '100%',
      },
      {
        id: 'test-tablet',
        query: '<982px',
        displayName: 'Tablet',
        previewSize: '820px',
      },
    ];
    const result = validateBreakpointsDefinition(breakpoints);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.details).toBe(
      'The first breakpoint should include the following attributes: { "query": "*" }',
    );
  });

  it('should validate that breakpoints have unique ids', () => {
    const breakpoints = [
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
        id: 'test-tablet',
        query: '<800px',
        displayName: 'Tablet',
        previewSize: '820px',
      },
    ];
    const result = validateBreakpointsDefinition(breakpoints);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.details).toBe('Breakpoint IDs must be unique');
  });

  it('should validate that breakpoint queries are ordered from largest to smallest', () => {
    const breakpoints = [
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
        query: '<1000px',
        displayName: 'Tablet',
        previewSize: '820px',
      },
    ];
    const result = validateBreakpointsDefinition(breakpoints);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.details).toBe(
      'Breakpoints should be ordered from largest to smallest pixel value',
    );
  });

  it('should validate that fields in breakpoint object', () => {
    const breakpoints = [
      {
        id: 'test-desktop',
        query: '*',
        displayName: 'All Sizes',
        previewSize: '100%',
        displayIcon: 'desktop',
      },
      {
        id: 'test-tablet',
        query: '<982px',
        displayName: 'Tablet',
        previewSize: '820px',
        displayIcon: 'tablet',
        wrongFieldAdded: 'test',
      },
    ];
    const result = validateBreakpointsDefinition(breakpoints);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.details).toBe('The property "wrongFieldAdded" is not expected');
  });
});
