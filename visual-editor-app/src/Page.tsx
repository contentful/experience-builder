import { useFetchExperience, ExperienceRoot } from '@contentful/experience-builder';
import { ExternalSDKMode, VisualEditorMode } from '@contentful/experience-builder-core';
import { createClient } from 'contentful';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import '@contentful/experience-builder-components/styles.css';
import './styles.css';

const isPreview = window.location.search.includes('isPreview=true');
const mode = isPreview ? 'preview' : (import.meta.env.VITE_MODE as ExternalSDKMode) || 'delivery';
const experienceTypeId = import.meta.env.VITE_EB_TYPE_ID || 'layout';
const visualEditorMode =
  (import.meta.env.VITE_VISUAL_EDITOR_MODE as VisualEditorMode) || VisualEditorMode.LazyLoad;
const localeCode = 'en-US';

const isStaging = import.meta.env.VITE_CONTENTFUL_ENV === 'staging';

const domain = isStaging ? 'flinkly' : 'contentful';

const client = createClient({
  space: import.meta.env.VITE_SPACE_ID || '',
  environment: import.meta.env.VITE_ENVIRONMENT_ID || 'master',
  host: isPreview ? `preview.${domain}.com` : `cdn.${domain}.com`,
  accessToken: isPreview
    ? import.meta.env.VITE_PREVIEW_ACCESS_TOKEN
    : import.meta.env.VITE_ACCESS_TOKEN,
});

export default function Page() {
  const { slug = 'homePage' } = useParams<{ slug: string }>();
  const { experience, fetchBySlug } = useFetchExperience({ client, mode });

  useEffect(() => {
    if (slug) {
      fetchBySlug({ experienceTypeId, slug, localeCode });
    }
  }, [fetchBySlug, slug]);

  return (
    <>
      <div
        style={{
          boxShadow: '0px 0px 24px rgba(0,0,0,.2)',
          backgroundColor: '#fff',
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          flex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 24px',
          alignItems: 'center',
        }}>
        <img
          src="https://images.ctfassets.net/w8vf7dk7f259/N3oD9LQUQYMIG4mj0IHck/2cae76d412675c96100941b2a381672d/colorful-coin-logo.svg"
          style={{
            height: 40,
          }}
          alt=""
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 16,
            fontSize: 'var(--cf-text-lg)',
            fontWeight: 'var(--cf-font-semibold)',
            fontFamily: 'var(--cf-font-family-sans)',
          }}>
          <a href="">Link 1</a>
          <a href="">Link 2</a>
          <a href="">Link 3</a>
        </div>
      </div>
      <ExperienceRoot
        experience={experience}
        locale={localeCode}
        visualEditorMode={visualEditorMode}
      />
      <footer
        style={{
          backgroundColor: '#000',
          paddingTop: 100,
          paddingBottom: 100,
          display: 'flex',
          justifyContent: 'center',
        }}>
        <div
          style={{
            maxWidth: 1200,
            color: '#fff',
          }}>
          Made with ❤️
        </div>
      </footer>
    </>
  );
}
