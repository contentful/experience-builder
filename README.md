# @contentful/experience-builder

Experience builder SDK by [Contentful](https://www.contentful.com/).

## Documentation

Please find more information about this sdk [on our Wiki page](https://github.com/contentful/experience-builder/wiki)

## Installation

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

Please find more setup examples [on a dedicated Wiki page](https://github.com/contentful/experience-builder/wiki/Setup-examples)

```tsx
import { useEffect, useRef } from 'react'
import {
  useFetchExperience,
  ExperienceRoot,
  defineComponents,
} from '@contentful/experience-builder'
import { createClient } from 'contentful'
import { useRouter } from 'next/router'

// component example can be found at the top of this document
import { MyButton } from './components/MyButton'

const client = createClient({
  space: 'YOUR_SPACE_ID',
  environment: 'YOUR_ENVIRONMENT_ID',
  host: 'preview.contentful.com', // Supported values: 'preview.contentful.com' or 'cdn.contentful.com',
  accessToken: 'YOUR_PREVIEW_OR_DELIVERY_TOKEN', // needs to be preview token if host = 'preview.contentful.com' and delivery token if 'cdn.contentful.com'
})

// 1. Define components outside of React (or within React - see 2.5)
defineComponents([
  {
    component: MyButton, // example component defined above in this file
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
  const fetchedOnce = useRef(false);
  const [error, setError] = useState();
  const router = useRouter();

  // You could nicely tie it to the useParam() from router or intenral state or locale manager
  const locale = router.locale;
  const slug = router.slug;

  // 2. Configure the sdk
  const { experience, isFetching, fetchBySlug } = useFetchExperience({
    client, // preview or delivery client
    /**
     * Supported values 'preview' or 'delivery'
     * 'preview' mode will fetch and render unpublished data from Contentful's preview api. Automatically supports canvas interactions if opened on canvas from Contentful's web app
     * 'delivery' mode will fetch and render published data from Contentful's delivery api
     *
     * you have the flexibility to define your own logic to determine the mode in which you want to run your website (for example: depending on the query parameter / hardcoded for a specific deployed instance of the website / env variable)
     */
    mode: 'preview',
  })

  // 3 - fetch the experience
  useEffect(() => {
    const fetchFn = async () => {
      setError(undefined);
      try {
       await fetchBySlug({ slug, experienceTypeId, locale })
      } catch (e) {
        setError(e);
      }
    }
    
    if (!experience && !fetchedOnce.current && !isFetching) {
      fetchedOnce.current = true;
      fetchFn();
    }
  }, [fetchBySlug, slug, experienceTypeId, locale]);

  return (
    <ExperienceRoot
      experience={experience}
      // The locale that will appear on the website first
      locale={locale}
    />
  )
}
```
