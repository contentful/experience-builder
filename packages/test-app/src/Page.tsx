import './eb-config';
import { useParams } from 'react-router-dom';
import '@contentful/experience-builder-components/styles.css';
import './styles.css';
import { ExperienceRoot, useFetchBySlug } from '@contentful/experience-builder';
import { useContentfulClient } from './hooks/useContentfulClient';
import { useContentfulConfig } from './hooks/useContentfulConfig';
import { defineComponents, defineDesignTokens } from '@contentful/experience-builder';
import Button, { buttonDefinition } from './components/buttons/Button';

const testExample = {
  spacing: { Zero: '0px', MMM: 'ff2048px', S: '20rem', M: '20%', L: '100%', XL: '128px' },
  sizing: {
    ZERO: '0px',
    XSSSSSSSSSSSSSS: 'fff100px',
    S: '2em',
    M: '300px',
    L: '600px',
    XL: '1024px',
  },
  colors: {
    WHITEEEEEEE: 'F#FFFFFF',
    Azure: 'azure',
    GREENGREENGREENGREENGREENGREENGREENGREENGREEN: '#00FF00',
    BLUE: '#0000Ff',
    primary: 'rgba(0, 0, 0, 0.25)ff',
    secondary: 'rgba(0, 255, 255, 0.5)',
    backup: 'rgba(30, 25, 25, 0.75)',
    fancy: `var(--text-primary)`,
  },
  border: {
    Whiteeeeeeeeeeeeeeeeeeeeeeeee: { width: '20px', color: 'F#FFFFFF', style: 'outside' },
    Azure: { width: '20px', color: 'azure', style: 'outside' },
    Hero: { width: '20px', color: '#ffaabb', style: 'outside' },
    Card: { width: '40px', color: '#ffccbb', style: 'inside' },
    Carousel: { width: '25px', style: 'inside', color: 'rgba(30, 25, 25, 0.75)' },
    Callout: { width: '25px', color: 'rgba(31, 25, 25, 0.75)' },
    'Case Study': { width: '25px', color: 'rgba(32, 25, 25, 0.75)' },
    Animal: { width: '25px', color: 'rgba(33, 25, 25, 0.75)' },
    Safari: { width: 'f25px', color: 'rgba(34, 25, 25, 0.75)' },
  },
};

const Colors = {
  Slate: '#94a3b8',
  Azure: 'azure',
  Orange: '#fdba74',
  Blue: '#0000Ff',
  Emerald: '#6ee7b7',
  Secondary: 'rgba(0, 255, 255, 0.5)',
  Primary: 'rgba(30, 25, 25, 0.75)',
};

const docExample = {
  spacing: { XS: '4px', S: '16px', M: '32px', L: '64px', XL: '128px' },
  sizing: { XS: '16px', S: '100px', M: '300px', L: '600px', XL: '1024px' },
  colors: Colors,
  border: {
    Azure: { width: '20px', style: 'outside', color: Colors.Azure },
    Hero: { width: '20px', style: 'outside', color: '#ffaabb' },
    Card: { width: '10px', style: 'inside', color: '#ffccbb' },
    Carousel: { width: '15px', style: 'outside', color: 'rgba(30, 25, 25, 0.75)' },
    Callout: { width: '15px', style: 'outside', color: '#22c55e' },
    'Case Study': { width: '15px', style: 'inside', color: '#0e7490' },
    Animal: { width: '25px', style: 'outside', color: '#8b5cf6' },
    Safari: { width: '8px', style: 'outside', color: 'rgba(127, 35, 105, 0.55)' },
  },
};
defineDesignTokens(docExample);

defineComponents([
  {
    component: Button,
    definition: buttonDefinition,
  },
]);

export default function Page() {
  const { slug = 'homePage' } = useParams<{ slug: string }>();
  const localeCode = 'en-US';
  const { mode, config } = useContentfulConfig();
  const { client } = useContentfulClient();

  const { experience, error, isLoading } = useFetchBySlug({
    slug,
    localeCode,
    mode,
    client,
    experienceTypeId: config.experienceTypeId,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return <ExperienceRoot experience={experience} locale={localeCode} />;
}
