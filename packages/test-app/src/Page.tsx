import { useParams } from 'react-router-dom';
import '@contentful/experience-builder-components/styles.css';
import './styles.css';
import { ExperienceRoot, defineComponents, useFetchBySlug } from '@contentful/experience-builder';
import { useContentfulClient } from './hooks/useContentfulClient';
import { useContentfulConfig } from './hooks/useContentfulConfig';
import Duplex from './components/Duplex';

defineComponents([
  {
    component: Duplex,
    definition: {
      id: 'duplex',
      children: true,
      name: 'Duplex',
      category: 'Basic',
      builtInStyles: ['cfMargin', 'cfPadding'],
      variables: {
        heading: {
          displayName: 'Heading',
          type: 'Text',
          defaultValue: 'Lorem ipsum',
        },
      },
    },
    options: {
      wrapComponent: false,
    },
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
