import './studio-config';
import { useParams } from 'react-router-dom';
import './styles.css';
import {
  ExperienceRoot,
  defineDesignTokens,
  useFetchBySlug,
  defineComponents,
} from '@contentful/experiences-sdk-react';
import { useContentfulClient } from './hooks/useContentfulClient';
import { useContentfulConfig } from './hooks/useContentfulConfig';
import { Foo } from './Foo';

const color = {
  Slate: '#94a3b8',
  Azure: 'azure',
  Orange: 'var(--cf-color-orange)',
  Blue: '#0000ff',
  Red: '#ff0000',
  Green: '#00ff00',
};

defineComponents([
  {
    component: Foo,
    definition: {
      id: 'foo',
      name: 'Foo',
      category: 'Custom Components',
      variables: {
        text: {
          displayName: 'Text',
          type: 'Text',
          defaultValue: 'Click me!',
          group: 'content',
        },
        thumbnail: {
          displayName: 'Thumbnail',
          type: 'Media',
          group: 'content',
        },
      },
    },
  },
]);

// defineDesignTokens({
//   "color": {
//     "Color 1": "rgba(186.624, 186.624, 186.624, 1.000)",
//     "Color 2": "rgba(62.208, 62.208, 62.208, 1.000)",
//     "Color 3": "rgba(29.184, 46.08, 59.136, 1.000)"
//   },
//   "sizing": {
//     "sizingM": "512px"
//   },
//   "spacing": {
//     "spacingM": "8px",
//     "spacingL": "16px"
//   },
//   "borderRadius": {
//     "radiusM": "12px",
//     "radiusL": "24px",
//     "radiusXL": "400px"
//   }
// });

// register design tokens
defineDesignTokens({
  spacing: { XS: '4px', S: '16px', M: '32px', L: '64px', XL: '128px' },
  sizing: { XS: '16px', S: '100px', M: '300px', L: '600px', XL: '1024px' },
  color: color,
  border: {
    Azure: { width: '11px', style: 'solid', color: color.Azure },
    Hero: { width: '12px', style: 'dashed', color: color.Orange },
    Card: { width: '11px', style: 'solid', color: color.Blue },
    Carousel: { width: '12px', style: 'dotted', color: color.Slate },
  },
  borderRadius: { XS: '2px', S: '4px', MMM: '16px', LLLLLLLLLLLLLL: '85px', XL: '1280px' },
  fontSize: { XS: '12px', SM: '14px', MD: '16px', LG: '24px', XL: '32px' },
  lineHeight: { XS: '1', SM: '1.25', MD: '1.5', LG: '200%' },
  letterSpacing: { None: '0', XS: '0.05em', SM: '0.1em', MD: '0.15em', LG: '0.2em' },
  textColor: { HexOrange: '#FFA500', Orange: 'var(--cf-color-orange)', Slate: '#94a3b8' },
  text: {
    first: {
      emphasis: 'bold',
      fontSize: '32px',
      case: 'uppercase',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0.1em',
      color: color.Red,
    },
    second: {
      emphasis: 'italic',
      fontSize: '24px',
      case: 'lowercase',
      fontWeight: '400',
      lineHeight: '1.25',
      letterSpacing: '0.05em',
      color: color.Green,
    },
  }
});

// defineDesignTokens({
//   "color": {
//     "Color 1": "rgba(186.624, 186.624, 186.624, 1.000)",
//     "Color 2": "rgba(62.208, 62.208, 62.208, 1.000)",
//     "Color 3": "rgba(29.184, 46.08, 59.136, 1.000)"
//   },
//   "sizing": {
//     "sizingM": "512px"
//   },
//   "spacing": {
//     "spacingM": "8px",
//     "spacingL": "16px"
//   },
//   "borderRadius": {
//     "radiusM": "12px",
//     "radiusL": "24px",
//     "radiusXL": "400px"
//   }
// });

export default function Page() {
  const { slug = 'home-page' } = useParams<{ slug: string }>();
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

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return <ExperienceRoot experience={experience} locale={localeCode} />;
}
