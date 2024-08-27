'use client';
import { useEffect, useState } from 'react';
import { EntityStore } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';
import { StudioExperienceMode } from '@contentful/experiences-core/constants';

export const useFetchByBase = (
  fetchMethod: () => Promise<Experience<EntityStore> | undefined>,
  mode: StudioExperienceMode,
) => {
  const [experience, setExperience] = useState<Experience<EntityStore>>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async () => {
      // if we are in editor/read only mode, we don't want to fetch the experience here
      // it is passed via postMessage instead
      if (mode === StudioExperienceMode.EDITOR || mode === StudioExperienceMode.READ_ONLY) {
        return;
      }
      setIsLoading(true);
      setError(undefined);
      try {
        const exp = await fetchMethod();
        setExperience(exp);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fetchMethod, mode]);

  return {
    error,
    experience,
    isLoading,
    mode,
  };
};
