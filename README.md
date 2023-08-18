```tsx
import { useEffect, useMemo } from 'react'
import {
  useExperienceBuilder,
  useComponents,
  CompositionRoot,
} from '@contentful/experience-builder'

// 1. Define the configuration
const config = {
  experienceTypeId: 'marketingWebsitePage', // id of the experience type
  slug: 'landing-page',
  accessToken: '*******',
  defaultLocale: 'en-US',
  environmentId: 'master',
  spaceId: 'sna0qik32a1',
};

const App = () => {
  const { defineComponent } = useComponents()

  // 2. Define components
  useEffect(() => {
    defineComponent('Button', componentDefinition)
  }, [defineComponent])

  const { settings, experience } = useExperienceBuilder(config)

  useEffect(() => {
    settings.setLocale('de-DE'); // change locale when needed
  }, [settings]);

  // 3. Render your experience
  return <CompositionRoot settings={settings} experience={experience} />
}
```

We used to restrict origin of the messages (`postMessage() API`), but currently removed this limitation. Messages are filtered by their schema.
