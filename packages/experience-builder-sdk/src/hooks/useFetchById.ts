import { useCallback } from 'react';
import type { ContentfulClientApi } from 'contentful';
import type { ExternalSDKMode } from '@contentful/experience-builder-core/types';
import { useFetchByBase } from './useFetchByBase';
import { fetchById } from '@contentful/experience-builder-core';
import { useDetectEditorMode } from './useDetectEditorMode';

export type UseFetchByIdArgs = {
  /** @deprecated mode no longer used */
  mode?: ExternalSDKMode;
  client: ContentfulClientApi<undefined>;
  id: string;
  experienceTypeId: string;
  localeCode: string;
};

export const useFetchById = ({ id, localeCode, client, experienceTypeId }: UseFetchByIdArgs) => {
  const isEditorMode = useDetectEditorMode();

  const fetchMethod = useCallback(() => {
    return fetchById({ id, localeCode, client, experienceTypeId });
  }, [id, localeCode, client, experienceTypeId]);

  return useFetchByBase(fetchMethod, isEditorMode);
};
