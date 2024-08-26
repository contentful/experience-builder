'use client';
import { useEffect, useState } from 'react';
import { EntityStore } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';

export const useFetchByBase = (
  fetchMethod: () => Promise<Experience<EntityStore> | undefined>,
  isEditorMode: boolean,
  isReadOnlyMode: boolean,
) => {
  const [experience, setExperience] = useState<Experience<EntityStore>>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async () => {
      // if we are in editor mode, we don't want to fetch the experience here
      // it is passed via postMessage instead
      if (isEditorMode || isReadOnlyMode) {
        console.log(
          '[ SDK ] useFetchByBase() isReadOnlyMode => ',
          isReadOnlyMode,
          ' or isEditorMode',
          isEditorMode,
          ' is true, returning early.',
        );

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
  }, [fetchMethod, isEditorMode]);

  return {
    error,
    experience,
    isLoading,
    isEditorMode,
  };
};
