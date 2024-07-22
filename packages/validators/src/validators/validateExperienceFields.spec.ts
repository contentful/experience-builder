import { validateExperienceFields } from './validateExperienceFields';
import { experience } from '../../test/__fixtures__/v2023_09_28/experience';
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
