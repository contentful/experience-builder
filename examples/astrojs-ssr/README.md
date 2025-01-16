# Studio Experiences with AstroJS server side rendering example

This example demonstrates how to use [Astro](https://astro.build/) to create a server rendered page with Studio Experiences.

> This example is a work-in-progress, and does not indicate that Astro is an officially supported framework for Studio Experiences. 

## Getting started

Before you begin, you should already have a Contentful space with Studio Experiences enabled and configured. If you do not yet have a space, please contact your Contentful account representative.

1. Clone the repo and install the app

To get started with this example, clone the repo, go into the examples/astrojs-ssr directory, and install the app:

```bash
npm install
```

2. Set up your environment variables

Next, set up your environment variables. Copy the `.env.local.example` file to `.env.local` and fill in the following variables:

- CTFL_SPACE: This is the Space ID of your Contentful space. This can be found in Settings>General Settings.
- CTFL_ACCESS_TOKEN: This is the Content Delivery API access token, which is used for fetching published data from your Contentful space. This can be found in Settings>API Keys.
- CTFL_PREVIEW_ACCESS_TOKEN: This is the Content Preview API access token, which is used for fetching draft data from your Contentful space. This can be found in Settings>API Keys.
- CTFL_ENVIRONMENT: This is the environment of your Contentful space. This can be found in Settings>General Settings. This can be found in Settings>Environments.
- CTFL_EXPERIENCE_TYPE= This is the content type id of the Experience content type in your Contentful space. This can be found in Content Model>Experience.

3. Start the development server

Now that you have set up your environment variables, you can start the development server:

```bash
npm run dev
```

The app is set up to run on `http://localhost:4321`. By default, the root URL will pull up an experience with the slug of 'home-page'. The locale will be determined by your browser settings.

For the localization, this app uses the built in [i18n](https://docs.astro.build/en/guides/internationalization/) routing of Astro. You can configure locales by adding them to the `i18n` section in the `astro.config.mjs` file.
