import { useFetchBySlug, ExperienceRoot, ExternalSDKMode } from '@contentful/experience-builder';
import { createClient } from 'contentful';
import '@contentful/experience-builder-components/styles.css';
import { useParams } from 'react-router-dom';
import '@contentful/experience-builder-components/styles.css';

const isPreview = window.location.search.includes('isPreview=true');
const mode = isPreview ? 'preview' : (import.meta.env.VITE_MODE as ExternalSDKMode) || 'delivery';
const experienceTypeId = import.meta.env.VITE_EXPERIENCE_TYPE_ID || 'layout';
const localeCode = 'en-US';
const domain = import.meta.env.VITE_DOMAIN || 'contentful.com';
const space = import.meta.env.VITE_SPACE_ID;
const environment = import.meta.env.VITE_ENVIRONMENT_TYPE_ID || 'master';
const host = isPreview ? `preview.${domain}` : `cdn.${domain}`;
const accessToken = isPreview
  ? import.meta.env.VITE_PREVIEW_ACCESS_TOKEN
  : import.meta.env.VITE_ACCESS_TOKEN;
const client = createClient({
  space,
  environment,
  host,
  accessToken,
});

const Page: React.FC = () => {
  const { slug = 'homePage' } = useParams<{ slug: string }>();
  const { experience, error } = useFetchBySlug({
    client,
    slug,
    mode,
    experienceTypeId,
    localeCode,
  });

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <ExperienceRoot experience={experience} locale={localeCode} />
    </>
  );
};

export default Page;
