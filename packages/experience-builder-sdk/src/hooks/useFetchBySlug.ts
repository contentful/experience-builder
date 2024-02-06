import { useCallback } from 'react';
import type { ContentfulClientApi } from 'contentful';
import type { ExternalSDKMode } from '@contentful/experience-builder-core/types';
import { useFetchByBase } from './useFetchByBase';
import { fetchBySlug } from '@contentful/experience-builder-core';

export type UseFetchBySlugArgs = {
  /** @deprecated mode no longer needed */
  mode?: ExternalSDKMode;
  client: ContentfulClientApi<undefined>;
  slug: string;
  experienceTypeId: string;
  localeCode: string;
};

export const useFetchBySlug = ({
  slug,
  localeCode,
  client,
  experienceTypeId,
}: UseFetchBySlugArgs) => {
  const fetchMethod = useCallback(() => {
    return fetchBySlug({ slug, localeCode, client, experienceTypeId });
  }, [slug, localeCode, client, experienceTypeId]);

  return useFetchByBase(fetchMethod);
};
