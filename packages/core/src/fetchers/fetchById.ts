import { createExperience } from './createExperience';
import { fetchExperienceEntry } from './fetchExperienceEntry';
import { fetchReferencedEntities } from './fetchReferencedEntities';
import { ExperienceEntry } from '@/types';
import { ContentfulClientApi, Entry } from 'contentful';
import {
  removeCircularPatternReferences,
  removeSelfReferencingDataSource,
} from './shared/circularityCheckers';
import { sideloadPrebindingDefaultValues } from './sideloading';

const errorMessagesWhileFetching = {
  experience: 'Failed to fetch experience',
  experienceReferences: 'Failed to fetch entities, referenced in experience',
};

const handleError = (generalMessage: string, error: unknown) => {
  const message = error instanceof Error ? error.message : `Unknown error: ${error}`;
  throw Error(message);
};

type FetchByIdParams = {
  /** instantiated client from the Contentful SDK */
  client: ContentfulClientApi<undefined>;
  /** id of the content type associated with the experience */
  experienceTypeId: string;
  /** id of the experience (defined in entry settings) */
  id: string;
  /** locale code to fetch the experience */
  localeCode: string;
  /** if the experience is being loaded in the Contentful Studio editor or not. If true, this function is a noop. */
  isEditorMode?: boolean;
};

/**
 * Fetches an experience entry by its id and additionally fetches all its references to return
 * an initilized experience instance.
 * @param {FetchByIdParams} options - options to fetch the experience
 */
export async function fetchById({
  client,
  experienceTypeId,
  id,
  localeCode,
  isEditorMode,
}: FetchByIdParams) {
  //Be a no-op if in editor mode
  if (isEditorMode) return;
  let experienceEntry: Entry | ExperienceEntry | undefined = undefined;

  if (!localeCode) {
    throw new Error('Failed to fetch by id. Required "localeCode" parameter was not provided');
  }

  try {
    experienceEntry = await fetchExperienceEntry({
      client,
      experienceTypeId,
      locale: localeCode,
      identifier: {
        id,
      },
    });

    if (!experienceEntry) {
      throw new Error(`No experience entry with id: ${id} exists`);
    }

    removeCircularPatternReferences(experienceEntry as ExperienceEntry);
    removeSelfReferencingDataSource(experienceEntry as ExperienceEntry);
    sideloadPrebindingDefaultValues(experienceEntry as ExperienceEntry);

    try {
      const { entries, assets } = await fetchReferencedEntities({
        client,
        experienceEntry,
        locale: localeCode,
      });

      const experience = createExperience({
        experienceEntry,
        referencedAssets: assets,
        referencedEntries: entries,
        locale: localeCode,
      });

      return experience;
    } catch (error) {
      handleError(errorMessagesWhileFetching.experienceReferences, error);
    }
  } catch (error) {
    handleError(errorMessagesWhileFetching.experience, error);
  }
}
