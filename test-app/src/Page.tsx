import {
  useFetchExperience,
  ExperienceRoot,
  ExternalSDKMode,
} from '@contentful/experience-builder';
import { createClient } from 'contentful';
import '@contentful/experience-builder-components/styles.css';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const isPreview = window.location.search.includes('isPreview=true');
const mode = isPreview ? 'preview' : (import.meta.env.VITE_MODE as ExternalSDKMode) || 'delivery';
const experienceTypeId = import.meta.env.VITE_EB_TYPE_ID || 'layout';

const client = createClient({
  space: import.meta.env.VITE_SPACE_ID || '',
  environment: import.meta.env.VITE_ENVIRONMENT_ID || 'master',
  host: isPreview ? 'preview.contentful.com' : 'cdn.contentful.com',
  accessToken: isPreview
    ? import.meta.env.VITE_PREVIEW_ACCESS_TOKEN
    : import.meta.env.VITE_ACCESS_TOKEN,
});

export default function Page() {
  const localeCode = 'en-US';
  const { slug = '' } = useParams<{ slug: string }>();

  const { experience, fetchBySlug } = useFetchExperience({ client, mode });

  useEffect(() => {
    if (slug) {
      fetchBySlug({ experienceTypeId, slug, localeCode });
    }
  }, [fetchBySlug, slug]);

  return <ExperienceRoot experience={experience} locale={localeCode} />;
}
