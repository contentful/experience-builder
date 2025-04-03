import type { Asset, Entry } from 'contentful';
import { isExperienceEntry } from '@/utils';
import type { Experience } from '@/types';
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
export function createExperience(json: string): Experience<EntityStore>;
export function createExperience(args: createExperienceArgs): Experience<EntityStore>;

export function createExperience(options: string | createExperienceArgs): Experience<EntityStore> {
  if (typeof options === 'string') {
    const entityStore = new EntityStore(options);
    return {
      entityStore,
    };
  } else {
    const { experienceEntry, referencedAssets, referencedEntries, locale } = options;
    if ([experienceEntry, ...referencedAssets, ...referencedEntries].some(isNotLocalized)) {
      throw new Error(
        'Some of the provided content is not localized. Please localize every entity before passing it to this function.',
      );
    }
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

const isNotLocalized = (entity: Entry | Asset) => {
  return !entity.sys.locale;
};
