import '@contentful/experiences-components-react/styles.css';
import './styles.css';
import { ExperienceRoot, useFetchById } from '@contentful/experiences-sdk-react';
import { createClient } from 'contentful';

// you can reuse existing contentful client if you already have it in your project
const client = createClient({
  // your space id
  space: import.meta.env.VITE_CTFL_SPACE,
  // your environment id
  environment: import.meta.env.VITE_CTFL_ENVIRONMENT,
  // Supported values: 'preview.contentful.com' or 'cdn.contentful.com',
  host: 'preview.contentful.com',
  // needs to be preview token if host = 'preview.contentful.com' and delivery token if 'cdn.contentful.com'
  accessToken: import.meta.env.VITE_CTFL_PREVIEW_ACCESS_TOKEN,
});

// example of the experience type id
const experienceTypeId = 'colorfulCoinContentModel';
const secondaryExperienceTypeId = 'studioTest';

export const Home = () => {
  // configure the sdk
  const { experience, isFetching, error } = useFetchById({
    client,
    spaceId: import.meta.env.VITE_CTFL_SPACE,
    id: '7IhOyEW8i8tfbiuvVKyw9w',
    localeCode: 'en-US',
    experienceTypeId,
  });

  return (
    <ExperienceRoot
      spaceId={import.meta.env.VITE_CTFL_SPACE}
      experience={experience}
      locale={'en-US'}
    />
  );
};

// you can reuse existing contentful client if you already have it in your project
const secondaryClient = createClient({
  // your space id
  space: import.meta.env.VITE_CTFL_SECONDARY_SPACE,
  // your environment id
  environment: import.meta.env.VITE_CTFL_SECONDARY_ENVIRONMENT,
  // Supported values: 'preview.contentful.com' or 'cdn.contentful.com',
  host: 'preview.contentful.com',
  // needs to be preview token if host = 'preview.contentful.com' and delivery token if 'cdn.contentful.com'
  accessToken: import.meta.env.VITE_CTFL_SECONDARY_PREVIEW_ACCESS_TOKEN,
});

export const SecondaryHome = () => {
  // configure the sdk
  // const { fetchBySlug, fetchById, experience, isFetching } = useFetchExperience({ client, mode: 'preview', id: '4ekyZAdMTIgeyBJVVTKbJ0', localeCode: 'en-US', experienceTypeId })
  const { experience, isFetching, error } = useFetchById({
    spaceId: import.meta.env.VITE_CTFL_SECONDARY_SPACE,
    client: secondaryClient,
    id: '2qlpLB50hqhFHchdmDkpcD',
    localeCode: 'en-US',
    experienceTypeId: secondaryExperienceTypeId,
  });

  return (
    <ExperienceRoot
      spaceId={import.meta.env.VITE_CTFL_SECONDARY_SPACE}
      experience={experience}
      locale={'en-US'}
    />
  );
};

export const App = () => {
  return (
    <div style={{ padding: '12px', background: '#d3d3d3' }}>
      Wrapper v1
      <div style={{ padding: '12px', background: '#4e6d93' /* maxHeight: '480px' */ }}>
        <h2>Primary:</h2>
        <Home />
      </div>
      <div style={{ height: '100px', background: '#709669', width: '100%' }}>DIVIDER</div>
      <div style={{ padding: '12px', background: '#8c7171' }}>
        <h2>Secondary:</h2>
        <SecondaryHome />
      </div>
    </div>
  );
};
