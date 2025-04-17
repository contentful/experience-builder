import { createExperience } from './createExperience';
import { fetchExperienceEntry } from './fetchExperienceEntry';
import { fetchReferencedEntities } from './fetchReferencedEntities';
import { ExperienceEntry } from '@/types';
import { ContentfulClientApi, Entry } from 'contentful';
import {
  removeCircularPatternReferences,
  removeSelfReferencingDataSource,
} from './shared/circularityCheckers';

const errorMessagesWhileFetching = {
  experience: 'Failed to fetch experience',
  experienceReferences: 'Failed to fetch entities, referenced in experience',
};

const handleError = (generalMessage: string, error: unknown) => {
  const message = error instanceof Error ? error.message : `Unknown error: ${error}`;
  throw Error(message);
};

type FetchBySlugParams = {
  /** instantiated client from the Contentful SDK */
  client: ContentfulClientApi<undefined>;
  /** id of the content type associated with the experience */
  experienceTypeId: string;
  /** slug of the experience (defined in entry settings) */
  slug: string;
  /** locale code to fetch the experience */
  localeCode: string;
  /** if the experience is being loaded in the Contentful Studio editor or not. If true, this function is a noop. */
  isEditorMode?: boolean;
};

/**
 * Fetches an experience entry by its slug and additionally fetches all its references to return
 * an initilized experience instance.
 * @param {FetchBySlugParams} options - options to fetch the experience
 */
export async function fetchBySlug({
  client,
  experienceTypeId,
  slug,
  localeCode,
  isEditorMode,
}: FetchBySlugParams) {
  // Be a no-op if in editor mode
  if (isEditorMode) return;
  let experienceEntry: Entry | ExperienceEntry | undefined = undefined;

  if (!localeCode) {
    throw new Error('Failed to fetch by slug. Required "localeCode" parameter was not provided');
  }

  try {
    experienceEntry = await fetchExperienceEntry({
      client,
      experienceTypeId,
      locale: localeCode,
      identifier: {
        slug,
      },
    });

    if (!experienceEntry) {
      throw new Error(`No experience entry with slug: ${slug} exists`);
    }

    removeCircularPatternReferences(experienceEntry as ExperienceEntry);
    removeSelfReferencingDataSource(experienceEntry as ExperienceEntry);

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
