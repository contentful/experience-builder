# Setup Examples

## Dynamic website
```tsx
import { useEffect, useMemo } from 'react'
import {
  useExperienceBuilder,
  CompositionRoot,
} from '@contentful/experience-builder'
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CTFL_SPACE_ID,
  environment: process.env.CTFL_ENV_ID,
  host: process.env.CTFL_API_HOST // Supported values: 'preview.contentful.com' or 'cdn.contentful.com',
  accessToken: process.env.CTFL_TOKEN, // needs to be preview token if host = 'preview.contentful.com' and delivery token if 'cdn.contentful.com'
});

const App = () => {
  // 1. Define the configuration and initialize the sdk
  const { settings, experience, defineComponent } = useExperienceBuilder({
    client, // preview or delivery client
    experienceTypeId: process.env.CTFL_EXPERIENCE_TYPE_ID, // id of the experience type (content type)
    defaultLocale: 'en-US', // The locale that will appear on the website first
    slug: 'landing-page', // slug of the entry. Will be used for fetching it using the client
    /**
     * Supported values 'editor' or 'preview' or 'delivery'
     * 'editor' is required when opening the website from Contentful's web app (app.contentful.com)
     * 'preview' mode will fetch and render unpublished data from Contentful's preview api
     * 'delivery' mode will fetch and render published data from Contentful's delivery api
     * 
     * you have the flexibility to define your own logic to determine the mode in which you want to run your website (for example: depending on the query parameter / hardcoded for a specific deployed instance of the website / env variable)
     */
    mode: 'delivery'
  })

  // 2. Define components
  useEffect(() => {
    defineComponent('Button', componentDefinition)
  }, [defineComponent])

  useEffect(() => {
    settings.setLocale('de-DE'); // change locale when needed
  }, [settings]);

  // 3. Render your experience
  return <CompositionRoot settings={settings} experience={experience} />
}
```

## Next.js website

SSR data pre-fetching is currently not possible. Stay tuned.

```tsx
import { useEffect, useMemo } from 'react'
import {
  useExperienceBuilder,
  CompositionRoot,
} from '@contentful/experience-builder'
import { createClient } from 'contentful'
import { useRouter } from 'next/router'

const client = createClient({
  space: process.env.CTFL_SPACE_ID,
  environment: process.env.CTFL_ENV_ID,
  host: process.env.CTFL_API_HOST // Supported values: 'preview.contentful.com' or 'cdn.contentful.com',
  accessToken: process.env.CTFL_TOKEN, // needs to be preview token if host = 'preview.contentful.com' and delivery token if 'cdn.contentful.com'
});

const Home = () => {
  const router = useRouter();
  // 1. Define the configuration and initialize the sdk
  const { settings, experience, defineComponent } = useExperienceBuilder({
    client, // preview or delivery client
    experienceTypeId: process.env.CTFL_EXPERIENCE_TYPE_ID, // id of the experience type (content type)
    defaultLocale: router.locale, // The locale that will appear on the website first
    slug: 'landing-page', // slug of the entry. Will be used for fetching it using the client
    /**
     * Supported values 'editor' or 'preview' or 'delivery'
     * 'editor' is required when opening the website from Contentful's web app (app.contentful.com)
     * 'preview' mode will fetch and render unpublished data from Contentful's preview api
     * 'delivery' mode will fetch and render published data from Contentful's delivery api
     * 
     * you have the flexibility to define your own logic to determine the mode in which you want to run your website (for example: depending on the query parameter / hardcoded for a specific deployed instance of the website / env variable)
     */
    mode: 'delivery'
  })

  // 2. Define components
  useEffect(() => {
    defineComponent('Button', componentDefinition)
  }, [defineComponent])

  useEffect(() => {
    settings.setLocale('de-DE'); // change locale when needed
  }, [settings]);

  // 3. Render your experience
  return <CompositionRoot settings={settings} experience={experience} />
}
```

## Gatsby website

SSR data pre-fetching is currently not possible. Stay tuned.

```tsx
import { useEffect, useMemo } from 'react'
import {
  useExperienceBuilder,
  CompositionRoot,
} from '@contentful/experience-builder'
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CTFL_SPACE_ID,
  environment: process.env.CTFL_ENV_ID,
  host: process.env.CTFL_API_HOST // Supported values: 'preview.contentful.com' or 'cdn.contentful.com',
  accessToken: process.env.CTFL_TOKEN, // needs to be preview token if host = 'preview.contentful.com' and delivery token if 'cdn.contentful.com'
});

const ExperienceBuilderPage = ({ pageContext }) => {
  const router = useRouter();
  // 1. Define the configuration and initialize the sdk
  const { settings, experience, defineComponent } = useExperienceBuilder({
    client, // preview or delivery client
    experienceTypeId: pageContext.expereinceTypeId, // id of the experience type (content type)
    defaultLocale: pageContext.locale, // The locale that will appear on the website first
    slug: pageContext.slug, // slug of the entry. Will be used for fetching it using the client
    /**
     * Supported values 'editor' or 'preview' or 'delivery'
     * 'editor' is required when opening the website from Contentful's web app (app.contentful.com)
     * 'preview' mode will fetch and render unpublished data from Contentful's preview api
     * 'delivery' mode will fetch and render published data from Contentful's delivery api
     * 
     * you have the flexibility to define your own logic to determine the mode in which you want to run your website (for example: depending on the query parameter / hardcoded for a specific deployed instance of the website / env variable)
     */
    mode: 'delivery'
  })

  // 2. Define components
  useEffect(() => {
    defineComponent('Button', componentDefinition)
  }, [defineComponent])

  useEffect(() => {
    settings.setLocale('de-DE'); // change locale when needed
  }, [settings]);

  // 3. Render your experience
  return <CompositionRoot settings={settings} experience={experience} />
}
```
