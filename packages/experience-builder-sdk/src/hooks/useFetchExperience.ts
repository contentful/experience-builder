import type { ContentfulClientApi } from 'contentful';
import { useCallback, useState } from 'react';
import {
  EntityStore,
  fetchBySlug as fetchBySlugCore,
  fetchById as fetchByIdCore,
} from '@contentful/experience-builder-core';
import { Experience, ExternalSDKMode } from '@contentful/experience-builder-core/types';

type useClientsideExperienceFetchersProps = {
  mode: ExternalSDKMode;
  client: ContentfulClientApi<undefined>;
};

/**
 * @deprecated please use `useFetchBySlug` or `useFetchById` hooks instead
 */
export const useFetchExperience = ({ mode, client }: useClientsideExperienceFetchersProps) => {
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
      try {
        const experience = await fetchBySlugCore({
          client,
          experienceTypeId,
          localeCode,
          slug,
          mode,
        });

        setExperience(experience);

        return experience;
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsFetching(false);
      }
    },
    [client, mode],
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
      setError(undefined);
      try {
        const experience = await fetchByIdCore({
          client,
          experienceTypeId,
          localeCode,
          id,
          mode,
        });

        setExperience(experience);
        return experience;
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsFetching(false);
      }
    },
    [client, mode],
  );

  return {
    fetchBySlug,
    fetchById,
    error,
    experience,
    isFetching,
  };
};
