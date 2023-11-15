import type { ContentfulClientApi, Entry } from 'contentful';
import { useCallback, useEffect, useState } from 'react';
import { EntityStore } from '../core/preview/EntityStore';
import { fetchReferencedEntities, fetchExperienceEntry } from '../core/fetchers';
import { Experience, ExternalSDKMode } from '../types';
import { createExperience } from '../utils/createExperience';

const errorMessagesWhileFetching = {
  experience: 'Failed to fetch experience',
  experienceReferences: 'Failed to fetch entities, referenced in experience',
};

const handleError = (generalMessage: string, error: unknown) => {
  const message = error instanceof Error ? error.message : `Unknown error: ${error}`;
  console.error(`${generalMessage} with error: ${message}`);
};

type useClientSideExperienceFetchersProps = {
  mode: ExternalSDKMode;
  client: ContentfulClientApi<undefined>;
  slug?: string;
  id?: string;
  experienceTypeId: string;
  localeCode: string;
};

export const useFetchExperience = ({
  mode,
  client,
  slug,
  id,
  experienceTypeId,
  localeCode,
}: useClientSideExperienceFetchersProps) => {
  const [experience, setExperience] = useState<Experience<EntityStore> | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error>();

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
      setError(undefined);

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
          setError(error);
          return;
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
        } catch (error) {
          handleError(errorMessagesWhileFetching.experienceReferences, error);
          setError(error as Error);
        }
      } catch (error) {
        handleError(errorMessagesWhileFetching.experience, error);
        setError(error as Error);
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
          setError(error as Error);
          return;
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
        } catch (error) {
          handleError(errorMessagesWhileFetching.experienceReferences, error);
          setError(error as Error);
        }
      } catch (error) {
        handleError(errorMessagesWhileFetching.experience, error);
        setError(error as Error);
      } finally {
        setIsFetching(false);
      }
    },
    [client, mode]
  );

  useEffect(() => {
    if (slug) {
      fetchBySlug({ slug, localeCode, experienceTypeId });
    } else if (id) {
      fetchById({ id, localeCode, experienceTypeId });
    } else {
      setError(Error('Either slug or id must be provided to useFetchExperience'));
    }
  }, [experienceTypeId, fetchById, fetchBySlug, id, localeCode, slug]);

  return {
    error,
    fetchBySlug,
    fetchById,
    experience,
    isFetching,
  };
};
