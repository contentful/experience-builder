import type { Asset, Entry } from 'contentful';
import { isExperienceEntry } from '@/utils';
import type { Experience } from '@/types';
import { EntityStore } from '@/entity/EntityStore';

type CreateExperienceParams = {
  experienceEntry: Entry;
  referencedEntries: Array<Entry>;
  referencedAssets: Array<Asset>;
  // TODO: Remove as it is not used by createExperience nor by the EntityStore nor EntityStoreBase
  locale: string;
};

/**
 * Create an experience instance using a serialized version of the entity store for SSR purposes.
 * @param {string} json - JSON representation of the experience
 */
export function createExperience(json: string): Experience<EntityStore>;
/**
 * Create an experience instance using the already fetched entries and assets.
 * @param options.experienceEntry - Localized experience entry which will be rendered
 * @param options.referencedEntries - Array of localized entries which are referenced by the experience entry in its dataSource
 * @param options.referencedAssets - Array of localized assets which are referenced by the experience entry in its dataSource
 * @param options.locale - (Soon to be removed unused parameter)
 */
export function createExperience(options: CreateExperienceParams): Experience<EntityStore>;

export function createExperience(
  options: string | CreateExperienceParams,
): Experience<EntityStore> {
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
