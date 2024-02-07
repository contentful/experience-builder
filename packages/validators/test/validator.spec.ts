import { validateExperienceFields } from '../src/validators';
import { experience } from './fixtures/v2023_09_28/experience';
import { describe, it, expect } from 'vitest';
import { SafeParseError, SafeParseSuccess } from 'zod';

describe('validateExperienceFields', () => {
  it('should return an error if schemaVersion is unsupported', () => {
    //@ts-expect-error - Testing invalid version
    const result = validateExperienceFields(experience, 'invalid-version') as SafeParseError<
      typeof experience
    >;

    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Unsupported schema version');
  });

  it('should validate the experience successfully', () => {
    const result = validateExperienceFields(experience, '2023-09-28') as SafeParseSuccess<
      typeof experience
    >;

    expect(result.success).toBe(true);
    expect(result.data).not.toBeUndefined();
  });
});
