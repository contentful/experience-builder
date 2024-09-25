import React from 'react';
import { createClient } from 'contentful';
import { useFetchBySlug, ExperienceRoot } from '@contentful/experiences-sdk-react';
import './App.css';

const accessToken = import.meta.env.VITE_CTFL_ACCESS_TOKEN!;
const prevAccessToken = import.meta.env.VITE_CTFL_PREVIEW_ACCESS_TOKEN!;
const space = import.meta.env.VITE_CTFL_SPACE!;
const environment = import.meta.env.VITE_CTFL_ENVIRONMENT!;
const experienceTypeId = import.meta.env.VITE_CTFL_EXPERIENCE_TYPE!;
const domain = import.meta.env.VITE_CTFL_DOMAIN || 'contentful.com';
const isPreview = false; // Could be dynamic
const localeCode = 'en-US'; // Could be dynamic

const client = createClient({
  space,
  environment,
  accessToken: isPreview ? prevAccessToken : accessToken,
  host: isPreview ? `preview.${domain}` : `cdn.${domain}`,
});

function App() {
  const { experience, isLoading, error } = useFetchBySlug({
    client,
    slug: 'home-page', //Could be fetched from the url,
    experienceTypeId,
    localeCode,
  });

  // handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <ExperienceRoot experience={experience} locale={localeCode} />;
}

export default App;
