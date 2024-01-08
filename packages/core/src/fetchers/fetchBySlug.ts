import { createExperience } from './createExperience';
import { fetchExperienceEntry } from './fetchExperienceEntry';
import { fetchReferencedEntities } from './fetchReferencedEntities';
import { ExperienceEntry, ExternalSDKMode } from '@/types';
import { ContentfulClientApi, Entry } from 'contentful';

const errorMessagesWhileFetching = {
  experience: 'Failed to fetch experience',
  experienceReferences: 'Failed to fetch entities, referenced in experience',
};

const handleError = (generalMessage: string, error: unknown) => {
  const message = error instanceof Error ? error.message : `Unknown error: ${error}`;
  throw Error(message);
};

/**
 * Fetch experience entry using slug as the identifier
 * @param {string} experienceTypeId - id of the content type associated with the experience
 * @param {string} slug - slug of the experience (defined in entry settings)
 * @param {string} localeCode - locale code to fetch the experience. Falls back to the currently active locale in the state
 */

//  Promise<Experience<EntityStore> | undefined> =>
export async function fetchBySlug({
  client,
  experienceTypeId,
  slug,
  localeCode,
  mode,
}: {
  client: ContentfulClientApi<undefined>;
  experienceTypeId: string;
  slug: string;
  localeCode: string;
  mode: ExternalSDKMode;
}) {
  let experienceEntry: Entry | ExperienceEntry | undefined = undefined;

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
        mode,
      });

      return experience;
    } catch (error) {
      handleError(errorMessagesWhileFetching.experienceReferences, error);
    }
  } catch (error) {
    handleError(errorMessagesWhileFetching.experience, error);
  }
}
