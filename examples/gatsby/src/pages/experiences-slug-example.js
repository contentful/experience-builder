import React from 'react'
import { ExperienceRoot, useFetchBySlug } from '@contentful/experiences-sdk-react';
import { useContentfulClient } from '../utils/useContentfulClient';

const slug = ''
const localeCode = '';
const experienceTypeId = '';

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
