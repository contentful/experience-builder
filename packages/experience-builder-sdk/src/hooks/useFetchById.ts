import { useCallback } from 'react';
import type { ContentfulClientApi } from 'contentful';
import type { ExternalSDKMode } from '@contentful/experience-builder-core/types';
import { useFetchByBase } from './useFetchByBase';
import { fetchById } from '@contentful/experience-builder-core';

export type UseFetchByIdArgs = {
  /** @deprecated mode no longer used */
  mode?: ExternalSDKMode;
  client: ContentfulClientApi<undefined>;
  id: string;
  experienceTypeId: string;
  localeCode: string;
};

export const useFetchById = ({ id, localeCode, client, experienceTypeId }: UseFetchByIdArgs) => {
  const fetchMethod = useCallback(() => {
    return fetchById({ id, localeCode, client, experienceTypeId });
  }, [id, localeCode, client, experienceTypeId]);

  return useFetchByBase(fetchMethod);
};
