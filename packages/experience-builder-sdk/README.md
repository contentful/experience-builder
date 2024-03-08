# @contentful/experiences-sdk-react

Experience builder SDK by [Contentful](https://www.contentful.com/).

## Documentation

Please find more information about this sdk [on our Wiki page](https://github.com/contentful/experience-builder/wiki)

## Installation

```
npm install @contentful/experiences-sdk-react
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
  );
}
```

## Setup example

Please find more setup examples [on a dedicated Wiki page](https://github.com/contentful/experience-builder/wiki/Setup-examples)

```tsx
import {
  defineComponents,
  defineDesignTokens,
  ExperienceRoot,
  useFetchBySlug,
} from '@contentful/experiences-sdk-react';

import { createClient } from 'contentful';

// component example can be found at the top of this document
import { MyButton } from './components/MyButton';

const client = createClient({
  space: 'YOUR_SPACE_ID',
  environment: 'YOUR_ENVIRONMENT_ID',
  host: 'preview.contentful.com', // Supported values: 'preview.contentful.com' or 'cdn.contentful.com',
  accessToken: 'YOUR_PREVIEW_OR_DELIVERY_TOKEN', // needs to be preview token if host = 'preview.contentful.com' and delivery token if 'cdn.contentful.com'
});

// 1. Define components outside of React
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
]);

// 2. Define design tokens (optional)
defineDesignTokens({
  spacing: { XS: '4px', S: '16px', M: '32px', L: '64px', XL: '128px' },
  color: { Slate: '#94a3b8', Azure: 'azure', Orange: '#fdba74' },
});

const Home = () => {

  // You could pull these values from your router, state, etc...
  const localeCode = 'en-US';  // the initial locale to use
  const slug = 'homePage'; // the slug of the experience to fetch
  const experienceTypeId = 'layout'; // the content id of the experience to fetch

  // 3. Fetch the experience
  const { experience, error, isLoading } = useFetchBySlug({
    client,
    slug,
    experienceTypeId,
    localeCode,
  });

  // 4. Handle loading state
  if(isLoading) {
    return <div>Loading...</div>
  }

  // 5. Handle errors
  if (error) {
    return <div>{error.message}</div>;
  }

  // 6. Render the experience
  return (
    <ExperienceRoot
      experience={experience}
      // The locale that will appear on the website first
      locale={locale}
    />
  );
};
```
