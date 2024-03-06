import { createClient } from 'contentful';
import { EntityStore, ExperienceRoot, fetchBySlug } from '@contentful/experiences-sdk-react';
import './App.css';
import { ExternalSDKMode } from '@contentful/experiences-sdk-react/dist/types';

// Import the styles for the default components
import '@contentful/experiences-components-react/styles.css';
import { useEffect, useState } from 'react';
import { Experience } from '@contentful/experiences-core/types';
import React from 'react';

const experienceTypeId = import.meta.env.VITE_EB_TYPE_ID || 'layout';

function App() {
  // Assume we are in editor mode if loaded in an iframe
  const isEditor = window.self !== window.top;

  // Run in preview mode if the url contains isPreview=true
  const isPreview = window.location.search.includes('isPreview=true');

  const mode = (isEditor || isPreview ? 'preview' : 'delivery') as ExternalSDKMode;

  // Create a Contentful client
  const client = createClient({
    space: import.meta.env.VITE_SPACE_ID || '',
    environment: import.meta.env.VITE_ENVIRONMENT_ID || 'master',
    host: isPreview ? 'preview.contentful.com' : 'cdn.contentful.com',
    accessToken: isPreview
      ? import.meta.env.VITE_PREVIEW_ACCESS_TOKEN
      : import.meta.env.VITE_ACCESS_TOKEN,
  });

  const [experience, setExperience] = useState<Experience<EntityStore>>();

  useEffect(() => {
    const fetchData = async () => {
      const experience = await fetchBySlug({
        client,
        experienceTypeId,
        slug: 'homePage',
        localeCode: 'en-US',
        mode,
      });

      setExperience(experience);
    };

    fetchData();
  }, [client, mode]);

  // Load your experience with slug 'homePage'
  return <ExperienceRoot slug={'homePage'} experience={experience} locale={'en-US'} />;
}

export default App;
