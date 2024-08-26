import { useCallback } from 'react';
import type { ContentfulClientApi } from 'contentful';
import { useFetchByBase } from './useFetchByBase';
import { fetchBySlug } from '@contentful/experiences-core';
import { useDetectEditorMode } from './useDetectEditorMode';
import { useDetectReadOnlyMode } from './useDetectReadOnlyMode';

export type UseFetchBySlugArgs = {
  client: ContentfulClientApi<undefined>;
  slug: string;
  experienceTypeId: string;
  localeCode: string;
  /** The pattern being used to generate links for hyperlink properties **/
  hyperlinkPattern?: string;
};

export const useFetchBySlug = ({
  slug,
  localeCode,
  client,
  experienceTypeId,
  hyperlinkPattern,
}: UseFetchBySlugArgs) => {
  const isEditorMode = useDetectEditorMode({ isClientSide: typeof window !== 'undefined' });
  const isReadOnlyMode = useDetectReadOnlyMode();

  const fetchMethod = useCallback(() => {
    return fetchBySlug({ slug, localeCode, client, experienceTypeId });
  }, [slug, localeCode, client, experienceTypeId]);

  const fetchResult = useFetchByBase(fetchMethod, isEditorMode, isReadOnlyMode);

  return { ...fetchResult, experience: { ...fetchResult.experience, hyperlinkPattern } };
};
