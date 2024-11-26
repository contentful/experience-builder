import { useCallback } from 'react';
import type { ContentfulClientApi } from 'contentful';
import { useFetchByBase } from './useFetchByBase';
import { fetchById } from '@contentful/experiences-core';
import { useDetectCanvasMode } from './useDetectCanvasMode';

export type UseFetchByIdArgs = {
  client: ContentfulClientApi<undefined>;
  id: string;
  experienceTypeId: string;
  localeCode: string;
  hyperlinkPattern?: string;
};

export const useFetchById = ({
  id,
  localeCode,
  client,
  experienceTypeId,
  hyperlinkPattern,
}: UseFetchByIdArgs) => {
  const mode = useDetectCanvasMode({ isClientSide: typeof window !== 'undefined' });

  const fetchMethod = useCallback(() => {
    return fetchById({ id, localeCode, client, experienceTypeId });
    // we purposely don't want to include the client in the dependencies
    // as it can cause infinite loops if the user creates the client in the component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, localeCode, experienceTypeId]);

  const fetchResult = useFetchByBase(fetchMethod, mode);

  return { ...fetchResult, experience: { ...fetchResult.experience, hyperlinkPattern } };
};
