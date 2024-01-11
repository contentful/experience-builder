# @contentful/experience-builder

Experience builder SDK by [Contentful](https://www.contentful.com/).

## Documentation

Please find more information about this sdk [on our Wiki page](https://github.com/contentful/experience-builder/wiki)

## Installation

```
npm install @contentful/experience-builder
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
import { useFetchBySlug, ExperienceRoot, defineComponents } from '@contentful/experience-builder';
import { createClient } from 'contentful';

// component example can be found at the top of this document
import { MyButton } from './components/MyButton';

const client = createClient({
  space: 'YOUR_SPACE_ID',
  environment: 'YOUR_ENVIRONMENT_ID',
  host: 'preview.contentful.com', // Supported values: 'preview.contentful.com' or 'cdn.contentful.com',
  accessToken: 'YOUR_PREVIEW_OR_DELIVERY_TOKEN', // needs to be preview token if host = 'preview.contentful.com' and delivery token if 'cdn.contentful.com'
});

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
]);

const Home = () => {

  // You could pull these values from your router, state, etc...
  const localeCode = 'en-US';  // the initial locale to use
  const slug = 'homePage'; // the slug of the experience to fetch
  const mode = 'delivery'; // 'delivery' or 'preview'
  const experienceTypeId = 'layout'; // the content id of the experience to fetch

  // 2. Fetch the experience
  const { experience, error, isLoading } = useFetchBySlug({
    client,
    slug,
    mode,
    experienceTypeId,
    localeCode,
  });

  // 3. Handle loading state
  if(isLoading) {
    return <div>Loading...</div>
  }

  // 4. Handle errors
  if (error) {
    return <div>{error.message}</div>;
  }

  // 5. Render the experience
  return (
    <ExperienceRoot
      experience={experience}
      // The locale that will appear on the website first
      locale={locale}
    />
  );
};
```


## Registering Design Tokens

In order to define your design tokens import the `defineDesignTokens` hook.
```
import { defineDesignTokens } from '@contentful/experience-builder'
```

There are several key terms that are specifically tied to the Design sidebar in Experience Builder, namely `spacing`, `sizing`, `colors`, and `borders`. You are also free to define your own custom key-value pairings however you like, just keep in mind that the key terms listed are specifically reserved to affect the Design sidebar.

Here's a quick example of a DesignTokenDefinition.
```
const DesignTokensDefinition = {
  spacing: { XS: '4px', S: '16px', M: '32px', L: '64px', XL: '128px' },
  sizing: { XS: '16px', S: '100px', M: '300px', L: '600px', XL: '1024px' },
  colors: {
    "Slate": "#94a3b8",
    "Azure": "azure",
    "Orange": "#fdba74",
    "Blue": "#0000Ff",

  },
  border: {
    "Azure": { width: '20px', style: 'outside', color: Colors.Azure },
    "Hero": { width: '20px', style: 'outside', color: "#ffaabb" },
    "Card": { width: '10px', style: 'inside', color: "#ffccbb" },
    "Carousel": { width: '15px', style: 'outside', color: 'rgba(30, 25, 25, 0.75)', },
  }
}
defineDesignTokens(DesignTokensDefinition)
```

Notice that for `spacing`, `sizing`, and `colors` that it's just a simple key-value object. `border` however, is a more complex object where its values have three parts rather than just a single string value.

## Design Token Documentation
Please refer to our [our Wiki page](https://github.com/contentful/experience-builder/wiki#design-token-documentation) for Design Token Documentation
