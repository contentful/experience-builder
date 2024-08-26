import { useCallback } from 'react';
import type { ContentfulClientApi } from 'contentful';
import { useFetchByBase } from './useFetchByBase';
import { fetchById } from '@contentful/experiences-core';
import { useDetectEditorMode } from './useDetectEditorMode';
import { useDetectReadOnlyMode } from './useDetectReadOnlyMode';

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
  const isEditorMode = useDetectEditorMode({ isClientSide: typeof window !== 'undefined' });
  const isReadOnlyMode = useDetectReadOnlyMode();

  console.log('[ useFetchById() ] isReadOnlyMode => ', isReadOnlyMode);

  const fetchMethod = useCallback(() => {
    return fetchById({ id, localeCode, client, experienceTypeId });
  }, [id, localeCode, client, experienceTypeId]);

  const fetchResult = useFetchByBase(fetchMethod, isEditorMode, isReadOnlyMode);

  return { ...fetchResult, experience: { ...fetchResult.experience, hyperlinkPattern } };
};
