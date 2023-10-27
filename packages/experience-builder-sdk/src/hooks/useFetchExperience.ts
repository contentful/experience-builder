import type { ContentfulClientApi, Entry } from 'contentful';
import { useCallback, useState } from 'react';
import { EntityStore } from '../core/EntityStore';
import { fetchReferencedEntities, fetchExperienceEntry } from '../core/fetchers';
import { Experience, ExternalSDKMode } from '../types';
import { createExperience } from '../core';

const errorMessagesWhileFetching = {
  experience: 'Failed to fetch experience',
  experienceReferences: 'Failed to fetch entities, referenced in experience',
};

const handleError = (generalMessage: string, error: unknown) => {
  const message = error instanceof Error ? error.message : `Unknown error: ${error}`;
  console.error(`${generalMessage} with error: ${message}`);
};

type useClientsideExperienceFetchersProps = {
  mode: ExternalSDKMode;
  client: ContentfulClientApi<undefined>;
};

export const useFetchExperience = ({ mode, client }: useClientsideExperienceFetchersProps) => {
  const [experience, setExperience] = useState<Experience<EntityStore> | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);

  /**
   * Fetch experience entry using slug as the identifier
   * @param {string} experienceTypeId - id of the content type associated with the experience
   * @param {string} slug - slug of the experience (defined in entry settings)
   * @param {string} localeCode - locale code to fetch the experience. Falls back to the currently active locale in the state
   */
  const fetchBySlug = useCallback(
    async ({
      experienceTypeId,
      slug,
      localeCode,
    }: {
      experienceTypeId: string;
      slug: string;
      localeCode: string;
    }): Promise<Experience<EntityStore> | undefined> => {
      setIsFetching(true);

      let experienceEntry: Entry | undefined = undefined;

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
          const error = new Error(`No experience entry with slug: ${slug} exists`);
          throw error;
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

          setExperience(experience);

          return experience;
        } catch (e) {
          handleError(errorMessagesWhileFetching.experienceReferences, e);
          throw e;
        }
      } catch (e) {
        handleError(errorMessagesWhileFetching.experience, e);
        throw e;
      } finally {
        setIsFetching(false);
      }
    },
    [client, mode]
  );

  /**
   * Fetch experience entry using id as the identifier
   * @param {string} experienceTypeId - id of the content type associated with the experience
   * @param {string} id - id of the experience (defined in entry settings)
   * @param {string} localeCode - locale code to fetch the experience. Falls back to the currently active locale in the state
   */
  const fetchById = useCallback(
    async ({
      experienceTypeId,
      id,
      localeCode,
    }: {
      experienceTypeId: string;
      id: string;
      localeCode: string;
    }): Promise<Experience<EntityStore> | undefined> => {
      setIsFetching(true);

      let experienceEntry: Entry | undefined = undefined;

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
          const error = new Error(`No experience entry with id: ${id} exists`);
          throw error;
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

          setExperience(experience);

          return experience;
        } catch (e) {
          handleError(errorMessagesWhileFetching.experienceReferences, e);
          throw e;
        }
      } catch (e) {
        handleError(errorMessagesWhileFetching.experience, e);
        throw e;
      } finally {
        setIsFetching(false);
      }
    },
    [client, mode]
  );

  return {
    fetchBySlug,
    fetchById,
    experience,
    isFetching,
  };
};
