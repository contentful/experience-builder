import { ExperienceRoot, useFetchExperience } from '@contentful/experience-builder';

import { useEffect, useState } from 'react';
import { useContentfulConfig } from './useContentfulConfig';
import { useContentfulClient } from './useContentfulClient';

export const useExperienceBuilder = (slug: string, localeCode: string) => {
  const { mode, config } = useContentfulConfig();
  const { client } = useContentfulClient();
  const { experience, error } = useFetchExperience({
    client,
    mode,
    experienceTypeId: config.experienceTypeId,
    localeCode,
    slug,
  });
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<Error>();

  // useEffect(() => {
  //   const fetchExperience = async () => {
  //     if (slug) {
  //       setIsLoading(true);
  //       try {
  //         await fetchBySlug({ experienceTypeId: config.experienceTypeId, slug, localeCode });
  //       } catch (error) {
  //         setError(error as Error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };
  //   fetchExperience();
  // }, [config, fetchBySlug, localeCode, slug]);

  return {
    ExperienceRoot: () => {
      return <ExperienceRoot experience={experience} locale={localeCode} />;
    },
    isLoading,
    error,
  };
};
