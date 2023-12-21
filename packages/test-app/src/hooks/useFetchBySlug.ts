import { ExternalSDKMode, useFetchExperience } from '@contentful/experience-builder';
import { ContentfulClientApi } from 'contentful';

type useFetchBySlugArgs = {
  mode: ExternalSDKMode;
  client: ContentfulClientApi<undefined>;
  slug?: string;
  id?: string;
  experienceTypeId: string;
  localeCode: string;
};

export const useFetchBySlug = ({
  client,
  mode,
  experienceTypeId,
  localeCode,
  slug,
}: useFetchBySlugArgs) => {
  const {
    experience,
    error,
    isFetching: isLoading,
  } = useFetchExperience({
    client,
    mode,
    experienceTypeId,
    localeCode,
    slug,
  });

  return { experience, error, isLoading };
};
