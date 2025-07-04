'use client';
import { useEffect, useState } from 'react';
import { EntityStore } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';
import { StudioCanvasMode } from '@contentful/experiences-core/constants';

// Typing the response explicitly ensures a stable interface for all fetchers
// and creates more readable type definitions for the SDK consumers.
type UseFetchByBaseResponse = {
  error: Error | undefined;
  experience: Experience<EntityStore> | undefined;
  isLoading: boolean;
  mode: StudioCanvasMode;
};

/**
 * If SDK is detects that it is managed by the Studio Canvas,
 * it's in "supervised mode" and should not fetch the experience explicitly.
 * (Instead, it will be passed via postMessage from the Studio Canvas.)
 */
const isSupervisedMode = (mode: StudioCanvasMode): boolean => {
  return mode === StudioCanvasMode.EDITOR || mode === StudioCanvasMode.READ_ONLY;
};

export const useFetchByBase = (
  fetchMethod: () => Promise<Experience<EntityStore> | undefined>,
  mode: StudioCanvasMode,
): UseFetchByBaseResponse => {
  const [experience, setExperience] = useState<Experience<EntityStore>>();
  // Must set depending on mode, otherwise it will always start with isLoading=false on initial render cycle.
  const [isLoading, setIsLoading] = useState(isSupervisedMode(mode) ? false : true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async () => {
      // if we are in editor/read only mode, we don't want to fetch the experience here
      // it is passed via postMessage instead
      if (isSupervisedMode(mode)) {
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

  // When a save event caused a canvas reload, the `receivedModeMessage` might time out and set the
  // mode temporarily to NONE. If it's set to a valid mode afterward, we ignore the fetch result.
  if (isSupervisedMode(mode)) {
    return {
      error: undefined,
      experience: undefined,
      isLoading: false,
      mode,
    };
  }

  return {
    error,
    experience,
    isLoading,
    mode,
  };
};
