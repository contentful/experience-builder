import { describe, it, expect } from 'vitest';
import { removeCircularReferences } from './removeCircularReferences';
import { ExperienceEntry } from '@/types';
import { experienceEntryFieldsWithFilledUsedComponents } from '@/test/__fixtures__/experience';

describe('removeCircularReferences', () => {
  const setup = () => {
    const circularEntry = {
      sys: {
        id: 'circular-entry',
        type: 'Entry',
      },
      fields: structuredClone(experienceEntryFieldsWithFilledUsedComponents),
    } as ExperienceEntry;
    const patternLevel1 = circularEntry.fields.usedComponents![0] as ExperienceEntry;
    const patternLevel2 = patternLevel1.fields.usedComponents![0] as ExperienceEntry;
    patternLevel2.fields.usedComponents = [patternLevel1];
    return { circularEntry };
  };

  it('should remove circular references from usedComponents', () => {
    const { circularEntry } = setup();
    removeCircularReferences(circularEntry);

    const patternLevel1 = circularEntry.fields.usedComponents![0] as ExperienceEntry;
    const patternLevel2 = patternLevel1.fields.usedComponents![0] as ExperienceEntry;

    expect(patternLevel2.fields.usedComponents).not.toEqual([patternLevel1]);
    expect(patternLevel2.fields.usedComponents).toEqual([
      {
        sys: {
          id: patternLevel1.sys.id,
          linkType: 'Entry',
          type: 'Link',
        },
      },
    ]);
  });

  it('should not fail when stringifying as JSON', () => {
    const { circularEntry } = setup();
    expect(() => removeCircularReferences(circularEntry)).not.toThrow();
  });
});
