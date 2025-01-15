import type { Asset, Entry } from 'contentful';
import { isExperienceEntry } from '@/utils/typeguards';
import type { Experience } from '@/types/Experience';
import { EntityStore } from '@/entity/EntityStore';

type createExperienceArgs = {
  experienceEntry: Entry;
  referencedEntries: Array<Entry>;
  referencedAssets: Array<Asset>;
  locale: string;
};

/**
 * Create an experience instance
 * @param {string} json - JSON representation of the experience
 */
// export function createExperience(json: string): Experience<EntityStore>;
export function createExperience(json: string): Experience;
export function createExperience(args: createExperienceArgs): Experience;
// export function createExperience(args: createExperienceArgs): Experience<EntityStore>;

// export function createExperience(options: string | createExperienceArgs): Experience<EntityStore> {
export function createExperience(options: string | createExperienceArgs): Experience {
  if (typeof options === 'string') {
    const entityStore = new EntityStore(options);
    return {
      entityStore,
    };
  } else {
    const { experienceEntry, referencedAssets, referencedEntries, locale } = options;
    if (!isExperienceEntry(experienceEntry)) {
      throw new Error('Provided entry is not experience entry');
    }

    const entityStore = new EntityStore({
      experienceEntry,
      entities: [...referencedEntries, ...referencedAssets],
      locale,
    });

    return {
      entityStore,
    };
  }
}
