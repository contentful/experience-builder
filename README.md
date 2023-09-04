# Setup Examples

## Dynamic website

```tsx
import { useEffect, useMemo } from 'react'
import {
  useExperienceBuilder,
  ExperienceRoot,
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
  const { experience, defineComponent } = useExperienceBuilder({
    client, // preview or delivery client
    experienceTypeId: process.env.CTFL_EXPERIENCE_TYPE_ID, // id of the experience type (content type)
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
    // You could also fetch it early if needed
    expereince.fetchBySlug({ slug: 'landing-page', localeCode: 'en-US', experienceTypeId: process.env.CTFL_EXPERIENCE_TYPE_ID })
  }, [experience])

  // 3. Render your experience
  return (
    <ExperienceRoot
      experience={experience}
      // The locale that will appear on the website first
      // You could nicely tie it to the useParam() from router or intenral state or locale manager
      // this value - en-US here is provided as an example reference
      locale='en-US'
      // slug of the entry. Will be used for fetching it using the client
      slug='landing-page'
    />
  );
}
```

## Next.js website

SSR data pre-fetching is currently not possible. Stay tuned.

```tsx
import { useEffect, useMemo } from 'react'
import {
  useExperienceBuilder,
  ExperienceRoot,
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

  return (
    <ExperienceRoot
      experience={experience}
      // The locale that will appear on the website first
      // You could nicely tie it to the useParam() from router or intenral state or locale manager
      // this value - en-US here is provided as an example reference
      locale={router.locale}
      // slug of the entry. Will be used for fetching it using the client
      slug='landing-page'
    />
  );
}
```

## Gatsby website

SSR data pre-fetching is currently not possible. Stay tuned.

```tsx
import { useEffect, useMemo } from 'react'
import {
  useExperienceBuilder,
  ExperienceRoot,
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

  // 3. Render your experience
  return (
    <ExperienceRoot
      experience={experience}
      // The locale that will appear on the website first
      // You could nicely tie it to the useParam() from router or intenral state or locale manager
      // this value - en-US here is provided as an example reference
      locale={pageContext.locale}
      // slug of the entry. Will be used for fetching it using the client
      slug={pageContext.slug}
    />
  );
}
```
