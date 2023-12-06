import {
  useFetchExperience,
  defineComponents,
  ExperienceRoot,
  ExternalSDKMode,
} from '@contentful/experience-builder';
import { createClient } from 'contentful';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useExperienceBuilderComponents } from '@contentful/experience-builder-components';
import '@contentful/experience-builder-components/styles.css';

const isPreview = window.location.search.includes('isPreview=true');
const mode = isPreview ? 'preview' : (import.meta.env.VITE_MODE as ExternalSDKMode) || 'delivery';
const experienceTypeId = import.meta.env.VITE_EB_TYPE_ID || 'layout';
const localeCode = 'en-US';

const client = createClient({
  space: import.meta.env.VITE_SPACE_ID || '',
  environment: import.meta.env.VITE_ENVIRONMENT_ID || 'master',
  host: isPreview ? 'preview.contentful.com' : 'cdn.contentful.com',
  accessToken: isPreview
    ? import.meta.env.VITE_PREVIEW_ACCESS_TOKEN
    : import.meta.env.VITE_ACCESS_TOKEN,
});

const Page: React.FC = () => {
  const { slug = 'homePage' } = useParams<{ slug: string }>();
  const { experience, fetchBySlug } = useFetchExperience({ client, mode });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useExperienceBuilderComponents(defineComponents as any);

  useEffect(() => {
    if (slug) {
      fetchBySlug({ experienceTypeId, slug, localeCode });
    }
  }, [fetchBySlug, slug]);

  return (
    <>
      <ExperienceRoot experience={experience} locale={localeCode} />
    </>
  );
};

export default Page;
