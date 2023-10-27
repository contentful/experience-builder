import type { Asset, Entry } from 'contentful';
import { isExperienceEntry } from '@contentful/experience-builder-types';
import { EntityStore } from './EntityStore';

import { Experience, ExternalSDKMode } from '../types';

type createExperienceArgs = {
  experienceEntry: Entry;
  referencedEntries: Array<Entry>;
  referencedAssets: Array<Asset>;
  locale: string;
  mode: ExternalSDKMode;
};

export const createExperience = ({
  experienceEntry,
  referencedAssets,
  referencedEntries,
  mode,
  locale,
}: createExperienceArgs): Experience<EntityStore> => {
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
    mode,
  };
};
