import { useCallback } from 'react';
import type { ContentfulClientApi } from 'contentful';
import { useFetchByBase } from './useFetchByBase';
import { fetchBySlug } from '@contentful/experiences-core';
import { useDetectEditorMode } from './useDetectEditorMode';

export type UseFetchBySlugArgs = {
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
  const isEditorMode = useDetectEditorMode({ isClientSide: typeof window !== 'undefined' });

  const fetchMethod = useCallback(() => {
    return fetchBySlug({ slug, localeCode, client, experienceTypeId });
  }, [slug, localeCode, client, experienceTypeId]);

  return useFetchByBase(fetchMethod, isEditorMode);
};
