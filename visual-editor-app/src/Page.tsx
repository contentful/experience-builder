import {
  useExperienceBuilder,
  ExperienceRoot,
  ExternalSDKMode,
} from '@contentful/experience-builder';
import React, { useMemo } from 'react';
import { createClient } from 'contentful';
import { useParams, useSearchParams } from 'react-router-dom';
import { useExperienceBuilderComponents } from '@contentful/experience-builder-components';
import '@contentful/experience-builder-components/styles.css';
import './styles.css';
const experienceTypeId = import.meta.env.VITE_EB_TYPE_ID || 'layout';

const Page: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [qs] = useSearchParams();

  const isPreview = qs.get('isPreview') === 'true';
  const isEditor = qs.get('isEditor') === 'true';

  const mode = isEditor ? 'editor' : isPreview ? 'preview' : 'delivery';
  //
  const client = useMemo(() => {
    const space = import.meta.env.VITE_SPACE_ID || '';
    const environment = import.meta.env.VITE_ENVIRONMENT_ID || 'master';
    const accessToken = isPreview
      ? import.meta.env.VITE_PREVIEW_ACCESS_TOKEN
      : import.meta.env.VITE_ACCESS_TOKEN;
    const host = isPreview ? 'preview.flinkly.com' : 'cdn.flinkly.com';

    return createClient({
      space,
      environment,
      host,
      accessToken: accessToken as string,
    });
  }, [isPreview]);

  const { experience, defineComponents } = useExperienceBuilder({
    experienceTypeId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: client as any,
    mode: mode as ExternalSDKMode,
  });

  useExperienceBuilderComponents(defineComponents);

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

      <ExperienceRoot slug={slug || '/'} experience={experience} locale={'en-US'} />
    </>
  );
};

export default Page;
