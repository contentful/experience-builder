import { useEffect, useState } from 'react';
import { EntityStore } from '@contentful/experience-builder-core';
import type { Experience } from '@contentful/experience-builder-core/types';

export const useFetchByBase = (fetchMethod: () => Promise<Experience<EntityStore> | undefined>) => {
  const [experience, setExperience] = useState<Experience<EntityStore>>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async () => {
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
  }, [fetchMethod]);

  return {
    error,
    experience,
    isLoading,
  };
};
