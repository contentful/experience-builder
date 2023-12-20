import { useCallback } from 'react';
import type { ContentfulClientApi } from 'contentful';
import type { ExternalSDKMode } from '@contentful/experience-builder-core/types';
import { useFetchByBase } from './useFetchByBase';
import { fetchById } from '@contentful/experience-builder-core';

export type useFetchByIdArgs = {
  mode: ExternalSDKMode;
  client: ContentfulClientApi<undefined>;
  id: string;
  experienceTypeId: string;
  localeCode: string;
};

export const useFetchById = ({
  id,
  localeCode,
  client,
  experienceTypeId,
  mode,
}: useFetchByIdArgs) => {
  const fetchMethod = useCallback(() => {
    return fetchById({ id, localeCode, client, experienceTypeId, mode });
  }, [id, localeCode, client, experienceTypeId, mode]);

  return useFetchByBase(fetchMethod);
};
