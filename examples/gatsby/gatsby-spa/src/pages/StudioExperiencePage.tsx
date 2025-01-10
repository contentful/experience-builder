import React from 'react';
import { useParams } from 'react-router';
import { ExperienceRoot, useFetchBySlug } from '@contentful/experiences-sdk-react';
import { useContentfulClient } from '../utils/useContentfulClient';

type PathParams = { localeCode: string; slug: string };

const experienceTypeId = process.env.GATSBY_CTFL_EXPERIENCE_TYPE || '';

export default function StudioExperiencePage() {
  const { localeCode = 'en-US', slug = 'StudioExperiencePage' } = useParams<PathParams>();

  const { client } = useContentfulClient();

  const { experience, error, isLoading } = useFetchBySlug({
    slug,
    localeCode,
    client,
    experienceTypeId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return <ExperienceRoot experience={experience} locale={localeCode} />;
}
