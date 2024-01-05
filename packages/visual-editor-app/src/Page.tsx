import {
  useFetchBySlug,
  ExperienceRoot,
  ExternalSDKMode,
  defineDesignTokens,
} from '@contentful/experience-builder';

import { createClient } from 'contentful';
import '@contentful/experience-builder-components/styles.css';
import { useParams, Link } from 'react-router-dom';
import './styles.css';

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

defineDesignTokens({
  spacing: { 0: '0px', XS: '16px', S: '24px', M: '32px', L: '64px', XL: '128px' },
  sizing: { 0: '0px', XS: '100px', S: '200px', M: '300px', L: '600px', XL: '1024px' },
  colors: {
    WHITE: '#FFFFFF',
    GREEN: '#00FF00',
    BLUE: '#0000Ff',
    primary: 'rgba(0, 0, 0, 0.25)',
    secondary: 'rgba(0, 255, 255, 0.5)',
    backup: 'rgba(30, 25, 25, 0.75)',
    fancy: 'rgb(0, 4, 7)',
  },
  border: {
    White: { size: '20px', color: '#FFFFFF', style: 'outside' },
    Azure: { size: '20px', color: 'azure', style: 'outside' },
    Hero: { size: '20px', color: '#ffaabb', style: 'outside' },
    Card: { size: '40px', color: '#ffccbb', style: 'inside' },
    Carousel: { size: '25px', color: 'rgba(30, 25, 25, 0.75)' },
    Callout: { size: '25px', color: 'rgba(31, 25, 25, 0.75)' },
    'Case Study': { size: '25px', color: 'rgba(32, 25, 25, 0.75)' },
    Animal: { size: '25px', color: 'rgba(33, 25, 25, 0.75)' },
    Safari: { size: '25px', color: 'rgba(34, 25, 25, 0.75)' },
  },
});

export default function Page() {
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
        <Link to="/">
          <img
            src="https://images.ctfassets.net/w8vf7dk7f259/N3oD9LQUQYMIG4mj0IHck/2cae76d412675c96100941b2a381672d/colorful-coin-logo.svg"
            style={{
              height: 40,
            }}
            alt=""
          />
        </Link>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 16,
            fontSize: 'var(--cf-text-lg)',
            fontWeight: 'var(--cf-font-semibold)',
            fontFamily: 'var(--cf-font-family-sans)',
          }}>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
      <ExperienceRoot experience={experience} locale={localeCode} />
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
