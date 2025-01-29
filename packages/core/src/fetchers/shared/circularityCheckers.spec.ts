import { describe, it, expect } from 'vitest';
import {
  removeCircularPatternReferences,
  removeSelfReferencingDataSource,
} from './circularityCheckers';
import { ExperienceEntry } from '@/types';
import { experienceEntryFieldsWithFilledUsedComponents } from '@/test/__fixtures__/experience';

describe('circularityCheckers', () => {
  describe('removeCircularPatternReferences', () => {
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
      removeCircularPatternReferences(circularEntry);

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
      expect(() => removeCircularPatternReferences(circularEntry)).not.toThrow();
    });
  });

  describe('removeSelfReferencingDataSource', () => {
    it('should remove self-referencing data sources', () => {
      const circularEntry = {
        sys: {
          id: 'circular-entry',
          type: 'Entry',
        },
        fields: {
          dataSource: {},
        },
      } as ExperienceEntry;
      // @ts-expect-error the CMA clients replaces links with entries while our types don't cover that
      circularEntry.fields.dataSource['random-data-source-key'] = circularEntry;

      removeSelfReferencingDataSource(circularEntry);

      expect(circularEntry.fields.dataSource['random-data-source-key']).toEqual({
        sys: {
          id: 'circular-entry',
          linkType: 'Entry',
          type: 'Link',
        },
      });
    });
  });
});
