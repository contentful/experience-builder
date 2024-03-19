import './eb-config';
import { useParams } from 'react-router-dom';
import '@contentful/experiences-components-react/styles.css';
import './styles.css';
import { ExperienceRoot, useFetchBySlug } from '@contentful/experiences-sdk-react';
import { useContentfulClient } from './hooks/useContentfulClient';
import { useContentfulConfig } from './hooks/useContentfulConfig';

export default function Page() {
  const { slug = 'homePage' } = useParams<{ slug: string }>();
  const localeCode = 'en-US';
  const { config } = useContentfulConfig();
  const { client } = useContentfulClient();

  console.log('slug', slug);
  const { experience, error, isLoading } = useFetchBySlug({
    slug,
    localeCode,
    client,
    experienceTypeId: config.experienceTypeId,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return <ExperienceRoot experience={experience} locale={localeCode} />;
}
