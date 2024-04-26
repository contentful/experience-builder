import './eb-config';
import { useParams } from 'react-router-dom';
import './styles.css';
import {
  ExperienceRoot,
  useFetchBySlug,
  // defineComponents,
} from '@contentful/experiences-sdk-react';
import { useContentfulClient } from './hooks/useContentfulClient';
import { useContentfulConfig } from './hooks/useContentfulConfig';
// import Button, { buttonDefinition } from './components/Button';
import { defineDesignTokens } from '@contentful/experiences-sdk-react';
// import AccordianDefinition, { accordianDefinition } from './components/Accordian';

// register design tokens
defineDesignTokens({
  spacing: { XS: "5px", S: "var(--cf-spacing-5)", M: "var(--cf-spacing-8)", L: "var(--cf-spacing-11)", XL: "var(--cf-spacing-13)" },
  sizing: { XS: '16px', S: '100px', M: '300px', L: '600px', XL: '1024px' },
  color: { Slate: 'var(--cf-color-white)', Azure: 'var(--cf-color-black)', Orange: 'var(--cf-color-gray100)', Blue: 'var(--cf-color-gray400)' },
  border: {
    Azure: { width: 'var(--cf-spacing-0)', style: 'solid', color: 'azure' },
    Hero: { width: '2px', style: 'dashed', color: '#ffaabb' },
    Card: { width: '1px', style: 'solid', color: 'var(--cf-button-color2)' },
    Carousel: { width: '2px', style: 'dotted', color: 'rgba(30, 25, 25, 0.75)' },
  },
  borderRadius: { XS: 'var(--cf-border-radius-sm)', S: 'var(--cf-border-radius-md)', MMM: 'var(--cf-border-radius-xl)', LLLLLLLLLLLLLL: 'var(--cf-border-radius-3xl)', XL: 'var(--cf-border-radius-full)' },
  fontSize: { XS: 'var(--cf-text-xs)', SM: 'var(--cf-text-base)', MD: 'var(--cf-text-xl)', LG: 'var(--cf-text-2xl)', XL: 'var(--cf-text-4xl)' },
  lineHeight: { XS: '1', SM: '1.25', MD: '1.5', LG: '200%' },
  letterSpacing: { None: '0', XS: '0.05em', SM: '0.1em', MD: '0.15em', LG: '0.2em' },
  textColor: { Dark: '#1a1a1a', Light: '#efefef', Slate: '#94a3b8' },
});

export default function Page() {
  const { slug = 'homePage' } = useParams<{ slug: string }>();
  const localeCode = 'en-US';
  const { config } = useContentfulConfig();
  const { client } = useContentfulClient();

  const { experience, error, isLoading } = useFetchBySlug({
    slug,
    localeCode,
    client,
    experienceTypeId: config.experienceTypeId,
    hyperlinkPattern: '/{entry.fields.slug}',
  });

  // defineComponents([
  //   {
  //     component: Button,
  //     definition: buttonDefinition,
  //   },
  //   { component: AccordianDefinition, definition: accordianDefinition },
  // ]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return <ExperienceRoot experience={experience} locale={localeCode} />;
}
