import { useCallback } from 'react';
import type { ContentfulClientApi } from 'contentful';
import { useFetchByBase } from './useFetchByBase';
import { fetchBySlug } from '@contentful/experiences-core';
import { useDetectCanvasMode } from './useDetectCanvasMode';

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
  const mode = useDetectCanvasMode({ isClientSide: typeof window !== 'undefined' });

  const fetchMethod = useCallback(() => {
    return fetchBySlug({ slug, localeCode, client, experienceTypeId });
  }, [slug, localeCode, client, experienceTypeId]);

  const fetchResult = useFetchByBase(fetchMethod, mode);

  return { ...fetchResult, experience: { ...fetchResult.experience, hyperlinkPattern } };
};
