import { validateExperienceFields } from '../src/validators';
import { experience } from './fixtures/experience_2023_09_28';
import { describe, it, expect } from 'vitest';

describe('validateExperienceFields', () => {
  it('should return an error if schemaVersion is unsupported', () => {
    //@ts-expect-error - Testing invalid version
    const result = validateExperienceFields(experience, 'invalid-version');

    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Unsupported schema version');
  });

  it('should validate the experience successfully', () => {
    const result = validateExperienceFields(experience, '2023-09-28');

    expect(result.success).toBe(true);
    expect(result.data).not.toBeUndefined();
  });
});
