import './studio-config';
import { useParams } from 'react-router-dom';
import './styles.css';
import { ExperienceRoot, useFetchBySlug } from '@contentful/experiences-sdk-react';
import { useContentfulClient } from './hooks/useContentfulClient';
import { useContentfulConfig } from './hooks/useContentfulConfig';

export default function Page() {
  const { slug = 'home-page', locale } = useParams<{ slug: string; locale?: string }>();
  const localeCode = locale ?? 'en-US';
  const { config } = useContentfulConfig();
  const { client } = useContentfulClient();

  const { experience, error, isLoading } = useFetchBySlug({
    slug,
    localeCode,
    client,
    experienceTypeId: config.experienceTypeId,
    hyperlinkPattern: '/{entry.fields.slug}',
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return <ExperienceRoot experience={experience} locale={localeCode} />;
}
