Please find more information about this sdk [on our Wiki page](https://github.com/contentful/experience-builder/wiki)

# Installation

```
npm install @contentful/experience-builder -S
```

```
yarn add @contentful/experience-builder
```

## Example Component:

```tsx
function MyButton({ buttonTitle, buttonUrl, ...props }) {
  // WARNING:
  //  - you must spread the props as last argument to enable canvas interactions and proper rendering on canvas
  //  - be sure to ensure that onClick handlers are above the {...props} spreading so that they are stubbed
  //    during EDITOR mode
  return (
    <button onClick={() => (window.location.href = buttonUrl)} {...props}>
      {buttonTitle}
    </button>
  )
}
```

## Setup example

```tsx
import { useEffect, useMemo } from 'react'
import {
  useExperienceBuilder,
  ExperienceRoot,
  defineComponents
} from '@contentful/experience-builder'
import { createClient } from 'contentful'
import { useRouter } from 'next/router'

const client = createClient({
  space: 'YOUR_SPACE_ID',
  environment: 'YOUR_ENVIRONMENT_ID',
  host: 'cdn.contentful.com', // Supported values: 'preview.contentful.com' or 'cdn.contentful.com',
  accessToken: 'YOUR_PREVIEW_OR_DELIVERY_TOKEN', // needs to be preview token if host = 'preview.contentful.com' and delivery token if 'cdn.contentful.com'
});

// 1. Define components outside of React (or within React - see 2.5)
defineComponents([
  {
    component: MyButton,  // example component defined above in this file
    definition: {
      id: 'my-button',
      name: 'MyButton',
      variables: {
        buttonTitle: { type: 'Text', defaultValue: 'Click me' },
        buttonUrl: {
          type: 'Text',
          defaultValue: 'https://www.contentful.com/',
        },
      },
    },
  },
])

const Home = () => {
  const router = useRouter();
  // 2. Configure the sdk
  const { settings, experience, defineComponents } = useExperienceBuilder({
    client, // preview or delivery client
    experienceTypeId: process.env.CTFL_EXPERIENCE_TYPE_ID, // id of the experience type (content type)
    /**
     * Supported values 'preview' or 'delivery'
     * 'preview' mode will fetch and render unpublished data from Contentful's preview api. Automatically supports canvas interactions if opened on canvas from Contentful's web app
     * 'delivery' mode will fetch and render published data from Contentful's delivery api
     *
     * you have the flexibility to define your own logic to determine the mode in which you want to run your website (for example: depending on the query parameter / hardcoded for a specific deployed instance of the website / env variable)
     */
    mode: 'delivery'
  })

  // 2.5 Define components via useEffect (or outside of React flow - see 1.)
  useEffect(() => {
    defineComponents([
      {
        component: MyButton,
        definition: {
          id: 'my-button',
          name: 'MyButton',
          variables: {
            buttonTitle: { type: 'Text', defaultValue: 'Click me' },
            buttonUrl: {
              type: 'Text',
              defaultValue: 'https://www.contentful.com/',
            },
          },
        },
      },
    ])
  }, [defineComponents]);

  return (
    <ExperienceRoot
      experience={experience}
      // The locale that will appear on the website first
      // You could nicely tie it to the useParam() from router or intenral state or locale manager
      // this value - en-US here is provided as an example reference
      locale={router.locale}
      // slug of the entry. Will be used for fetching it using the client
      slug='SLUG_FROM_YOUR_EXPERIENCE_ENTRY'
    />
  );
}
```
