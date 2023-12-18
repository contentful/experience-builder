import { createClient } from 'contentful';
import { useExperienceBuilder, ExperienceRoot } from '@contentful/experience-builder';
import { useExperienceBuilderComponents } from '@contentful/experience-builder-components';
import './App.css';
import { ExternalSDKMode } from '@contentful/experience-builder/dist/types';

// Import the styles for the default components
import '@contentful/experience-builder-components/styles.css';

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

  const { experience, defineComponents } = useExperienceBuilder({
    experienceTypeId,
    client,
    mode,
  });

  // Register optional default components
  useExperienceBuilderComponents(defineComponents);

  // Load your experience with slug 'homePage'
  return <ExperienceRoot slug={'homePage'} experience={experience} locale={'en-US'} />;
}

export default App;
