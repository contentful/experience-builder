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
  }, [id, localeCode, client, experienceTypeId]);

  const fetchResult = useFetchByBase(fetchMethod, mode);

  return { ...fetchResult, experience: { ...fetchResult.experience, hyperlinkPattern } };
};
