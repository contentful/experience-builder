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
    // we purposely don't want to include the client in the dependencies as it can cause infinite loops if the
    // user creates the client in the component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, localeCode, experienceTypeId]);

  const fetchResult = useFetchByBase(fetchMethod, mode);

  return { ...fetchResult, experience: { ...fetchResult.experience, hyperlinkPattern } };
};
