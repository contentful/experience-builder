import { useFetchBySlug, ExperienceRoot } from '@contentful/experiences-sdk-react';
import { PageProps } from 'gatsby';
import React from 'react';
import { useContentfulClient } from '../../utils/useContentfulClient';

type PathParams = {
  locale: string;
  slug: string,
  isPreviewString: string;
};

const experienceTypeId = process.env.GATSBY_CTFL_EXPERIENCE_TYPE || '';

export default function StudioExperiencePage(pageProps: PageProps) {
  const { locale = 'en-US', slug = 'home-page', } = pageProps.params as PathParams;
  const isPreview = new URL(pageProps.location.href).searchParams.get('isPreview') === 'true';
  const { client } = useContentfulClient({ isPreview });

  const { experience, error, isLoading } = useFetchBySlug({
    slug,
    localeCode: locale,
    client,
    experienceTypeId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return <ExperienceRoot experience={experience} locale={locale} />;
}