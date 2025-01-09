import React from 'react'
import { ExperienceRoot, useFetchBySlug } from '@contentful/experiences-sdk-react';
import { useContentfulClient } from '../utils/useContentfulClient';

const slug = 'ExperienceSlugExample'
const localeCode = 'en-US';
const experienceTypeId = process.env.GATSBY_CTFL_EXPERIENCE_TYPE || '';

export default function ExperienceSlugExample() {
  const { client } = useContentfulClient();

  const { experience, error, isLoading } = useFetchBySlug({
    slug,
    localeCode,
    client,
    experienceTypeId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <ExperienceRoot experience={experience} locale={localeCode} />
  )
}
