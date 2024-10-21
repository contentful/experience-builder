import { createExperience } from './createExperience';
import { fetchExperienceEntry } from './fetchExperienceEntry';
import { fetchReferencedEntities } from './fetchReferencedEntities';
import { ExperienceEntry } from '@/types';
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
export async function fetchById({
  client,
  experienceTypeId,
  id,
  localeCode,
}: {
  client: ContentfulClientApi<undefined>;
  experienceTypeId: string;
  id: string;
  localeCode: string;
}) {
  let experienceEntry: Entry | ExperienceEntry | undefined = undefined;

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
