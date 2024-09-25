import React from 'react';
import { createClient } from 'contentful';
import { useFetchBySlug, ExperienceRoot } from '@contentful/experiences-sdk-react';
import './App.css';

const experienceTypeId = import.meta.env.VITE_CTFL_EXPERIENCE_TYPE_ID; //Content type id for the experience
const localeCode = 'en-US'; //Locale code for the experience (could be dynamic)

const client = createClient({
  // your space id
  space: import.meta.env.VITE_CTFL_SPACE_ID,
  // your environment id
  environment: import.meta.env.VITE_CTFL_ENV_ID,
  // Supported values: 'preview.contentful.com' or 'cdn.contentful.com',
  host: import.meta.env.VITE_CTFL_API_HOST,
  // needs to be access token if host = 'cdn.contentful.com' and preview token if 'preview.contentful.com'
  accessToken: import.meta.env.VITE_CTFL_ACCESS_TOKEN,
});

function App() {
  const { experience, isLoading, error } = useFetchBySlug({
    client,
    slug: 'homePage', //Could be fetched from the url,
    experienceTypeId,
    localeCode,
  });

  // handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <ExperienceRoot experience={experience} locale={localeCode} />;
}

export default App;
