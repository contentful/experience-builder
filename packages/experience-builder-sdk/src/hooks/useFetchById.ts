import { useCallback } from 'react';
import type { ContentfulClientApi } from 'contentful';
import { useFetchByBase } from './useFetchByBase';
import { fetchById } from '@contentful/experiences-core';
import { useDetectEditorMode } from './useDetectEditorMode';

export type UseFetchByIdArgs = {
  client: ContentfulClientApi<undefined>;
  id: string;
  experienceTypeId: string;
  localeCode: string;
  spaceId?: string;
};

export const useFetchById = ({
  id,
  localeCode,
  client,
  experienceTypeId,
  spaceId,
}: UseFetchByIdArgs) => {
  const isEditorMode = useDetectEditorMode({
    isClientSide: typeof window !== 'undefined',
    spaceId,
  });

  const fetchMethod = useCallback(() => {
    console.log('fetch method');
    return fetchById({ id, localeCode, client, experienceTypeId });
  }, [id, localeCode, client, experienceTypeId]);

  return useFetchByBase(fetchMethod, isEditorMode);
};
