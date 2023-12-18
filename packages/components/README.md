# Experience Builder Components

> Experience Builder is currently in a private alpha and not available publicly. If you are interested in participating in the alpha, please reach out to your Contentful account team.

This folder contains the source code for the default/example components that can be used with Experience Builder. These components can be used as-is to kick start building your experiences, or used as an example for building your own components.

## In this guide

- [Components](#components)
- [Getting started](#getting-started)
  * [Installation](#installation)
  * [Register the components with Experience Builder](#register-the-components-with-experience-builder)
- [Styling](#styling)
  * [Including default styles](#including-default-styles)
  * [Adding custom styles](#adding-custom-styles)
- [withExperienceBuilder util](#withexperiencebuilder-util)
  * [Usage](#usage)


## Components

The following components are available:

- [Button](src/components/Button/README.md)
- [Heading](src/components/Heading/README.md)
- [Image](src/components/Image/README.md)
- [RichText](src/components/RichText/README.md)
- [Text](src/components/Text/README.md)

## Getting started

### Installation

```bash
npm install @contentful/experience-builder-components
```

### Register the components with Experience Builder

> This guide assumes you already have Experience Builder configured in your application and space. If you don't, please contact your Contentful representative for instructions on how to do so.

In the section of code (usually the main App or Page components) where Experience Builder is configured, perform the following steps:

Import the `useExperienceBuilderComponents` hook from the `@contentful/experience-builder-components` package:

```jsx
import { useExperienceBuilderComponents } from '@contentful/experience-builder-components';
```

After the call to `useExperienceBuilder` (where you obtain the `defineComponents` method), pass in `defineComponents` to the `userExperienceBuilder` hook:

```jsx
useExperienceBuilderComponents(defineComponents);
```

All of the components will now be available for use in your experiences.

## Styling

By default, the components are unstyled. This allows you to style the components to match your brand and design system. If you want a set of default styles to get started, see below.

### Including default styles

A set of optional, default styles are included with the components. To include them, import the `styles.css` file from the `@contentful/experience-builder-components` package:

```jsx
import '@contentful/experience-builder-components/styles.css';
```

### Adding custom styles

Each component has a css class that you can use to add your own styles. The classes are named in the style of `cf-{component-name}` (ie `cf-button`).

For example, to style the `Button` component, you can do the following:

```css
.cf-button {
  /* your styles here */
}
```

All components also support passing in custom class names via the `className` prop. This allows you to add your own class names to the component, which you can then use to style the component.

## withExperienceBuilder util

We provide a helper function (as a [higher-order-component](https://legacy.reactjs.org/docs/higher-order-components.html)) to make it easier to register your own custom components with Experience Builder. This function helps ensure your component has all the required props and is properly registered with Experience Builder.

### Usage

```jsx
import { withExperienceBuilder } from '@/utils/withExperienceBuilder';
import { MyComponent } from './MyComponent';

export const ExperienceBuilderMyComponent = withExperienceBuilder(
  // Your component
  MyComponent,
  // component registration configuration for EB
  {
    id: 'my-component',
    name: 'My Component',
    category: 'Custom',
    variables: {
      label: {
        type: 'Text',
        defaultValue: 'My Component',
      },
    },
  },
);
```

### Container wrapping

By default, the `withExperienceBuilder` function will not wrap your component in a container. However, it is often useful to have your component wrapped. If the components is wrapped, all the styles generated from Experience Builder will be applied to the wrapping container instead of the component itself. This will make it so the additional styles don't interfere with your component's styles.

To wrap your component, pass in the `wrapComponent` option:

```jsx
export const ExperienceBuilderMyComponent = withExperienceBuilder(
  // Your component
  MyComponent,
  // component registration configuration for EB
  { /* EB config */ },
  // wrap the component with a container (defaults to false)
  { wrapComponent: true }
);
```

You can also provide the tag name the container will use (which defaults to 'div'):

```tsx
{ wrapComponent: true, wrapContainerTag: 'span' }
```