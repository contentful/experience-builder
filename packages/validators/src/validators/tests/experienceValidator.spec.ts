import { experience, experiencePattern } from '@/test/__fixtures__/v2023_09_28';
import { describe, it, expect } from 'vitest';
import { validateExperienceFields } from '@/validators';
import * as validatePattern from '@/validators/validatePatternFields';
import { vi } from 'vitest';

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

  it('should return an error if parameterDefinitions contentTypes do not use a link reference', () => {
    const clonedExperiencePattern = JSON.parse(JSON.stringify(experiencePattern));
    // @ts-ignore - force type for invalid contentTypes test
    clonedExperiencePattern.fields.componentSettings['en-US'].parameterDefinitions[
      '8v3GB67qF5f'
    ].contentTypes.productFeatureTopic = {
      ...clonedExperiencePattern.fields.componentSettings['en-US'].parameterDefinitions[
        '8v3GB67qF5f'
      ].contentTypes.productFeatureTopic.sys,
    };
    const result = validateExperienceFields(clonedExperiencePattern, schemaVersion);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.name).toBe('required');
    expect(error?.details).toBe(`The property "sys" is required here`);
  });

  it('should validate the experience successfully', () => {
    const result = validateExperienceFields(experience, schemaVersion);

    expect(result.success).toBe(true);
  });

  it('should not use pattern validator to validate experience', () => {
    const validatePatternFields = vi.spyOn(validatePattern, 'validatePatternFields');
    const _ = validateExperienceFields(experience, schemaVersion);
    expect(validatePatternFields).not.toHaveBeenCalled();
  });

  it('should use pattern validator to validate pattern', () => {
    const validatePatternFields = vi
      .spyOn(validatePattern, 'validatePatternFields')
      .mockReturnValue('mocked result' as any);
    const result = validateExperienceFields(experiencePattern as any, schemaVersion);
    expect(validatePatternFields).toHaveBeenCalledWith(experiencePattern, schemaVersion);
    expect(result).toEqual('mocked result');
  });
});
