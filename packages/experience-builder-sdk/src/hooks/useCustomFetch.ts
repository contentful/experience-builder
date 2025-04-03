import { useCallback } from 'react';
import { useFetchByBase } from './useFetchByBase';
import { useDetectCanvasMode } from './useDetectCanvasMode';
import { Experience } from '@contentful/experiences-core/types';
import { EntityStore } from '@contentful/experiences-core';

export type UseCustomFetchArgs = {
  fetchFn: () => Promise<Experience<EntityStore> | undefined>;
  /** The pattern being used to generate links for hyperlink properties **/
  hyperlinkPattern?: string;
};

export const useCustomFetch = ({ fetchFn, hyperlinkPattern }: UseCustomFetchArgs) => {
  const mode = useDetectCanvasMode({ isClientSide: typeof window !== 'undefined' });

  const fetchMethod = useCallback(() => {
    return fetchFn();
    // we purposely don't want to include the client in the dependencies as it can cause infinite loops if the
    // user creates the client in the component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchResult = useFetchByBase(fetchMethod, mode);

  return { ...fetchResult, experience: { ...fetchResult.experience, hyperlinkPattern } };
};
