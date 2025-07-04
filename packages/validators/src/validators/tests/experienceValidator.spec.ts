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

  it('should return an error if parameterDefinitions contentTypes is not an array of string', () => {
    const clonedExperiencePattern = JSON.parse(JSON.stringify(experiencePattern));
    clonedExperiencePattern.fields.componentSettings[
      'en-US'
    ].prebindingDefinitions[0].parameterDefinitions['8v3GB67qF5f'].contentTypes = [
      {
        productFeatureTopic: {
          sys: {
            id: 'productFeatureTopic',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
      },
    ];
    const result = validateExperienceFields(clonedExperiencePattern, schemaVersion);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.name).toBe('type');
    expect(error?.details).toBe(`The type of "0" is incorrect, expected type: string`);
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
