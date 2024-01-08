import type { Entry } from 'contentful';
import { compositionEntry } from '../test/__fixtures__/composition';
import { assets, entries } from '../test/__fixtures__/entities';
import { createExperience } from './createExperience';
import { describe, it, expect } from 'vitest';

describe('createExperience', () => {
  it('throws an error if given entry is not an experience entry', () => {
    try {
      createExperience({
        experienceEntry: entries[0],
        referencedAssets: [],
        referencedEntries: [],
        locale: 'en-US',
        mode: 'preview',
      });
      throw new Error('Should not reach this point');
    } catch (e) {
      expect((e as Error).message).toEqual('Provided entry is not experience entry');
    }
  });

  it('should return the instance of an entity store and mode', () => {
    const experience = createExperience({
      experienceEntry: compositionEntry as unknown as Entry,
      referencedEntries: entries,
      referencedAssets: assets,
      locale: 'en-US',
      mode: 'preview',
    });

    expect(experience.mode).toBe('preview');
    expect(experience.entityStore).toBeDefined();
    expect(experience.entityStore?.experienceEntryFields).toEqual(compositionEntry.fields);
    expect(experience.entityStore?.getCurrentLocale()).toBe('en-US');
  });
});
