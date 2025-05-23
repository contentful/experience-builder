# Studio Experiences with Next.js Pages Router example

This example demonstrates how to use the [Next.js Pages Router](https://nextjs.org/docs/pages) to create a server rendered page with Studio Experiences.

For more information, see [Using Experiences with Next.js](https://www.contentful.com/developers/docs/experiences/using-with-nextjs/) in the Contentful docs.

## Getting started

Before you begin, you should already have a Contentful space with Studio Experiences enabled and configured. If you do not yet have a space, please contact your Contentful account representative.

### Step 1: Clone the repo and install the app

To get started with this example, clone the repo, go into the examples/next-pages-router directory, and install the app:

```bash
npm install
```

### Step 2: Set up your environment variables

Next, you will need to set up your environment variables. Copy the `.env.local.example` file to `.env.local` and fill in the following variables:

- NEXT_PUBLIC_CTFL_SPACE: This is the Space ID of your Contentful space. This can be found in Settings>General Settings.
- NEXT_PUBLIC_CTFL_ACCESS_TOKEN: This is the Content Delivery API access token, which is used for fetching published data from your Contentful space. This can be found in Settings>API Keys.
- NEXT_PUBLIC_CTFL_PREVIEW_ACCESS_TOKEN: This is the Content Preview API access token, which is used for fetching draft data from your Contentful space. This can be found in Settings>API Keys.
- NEXT_PUBLIC_CTFL_ENVIRONMENT: This is the environment of your Contentful space. This can be found in Settings>General Settings. This can be found in Settings>Environments.
- NEXT_PUBLIC_CTFL_EXPERIENCE_TYPE= This is the content type id of the Experience content type in your Contentful space. This can be found in Content Model>Experience.

### Step 3: Start the development server

Now that you have set up your environment variables, you can start the development server:

```bash
npm run dev
```

The app is set up to run on `http://localhost:3000`. By default, the root URL will pull up an experience with the slug of 'home-page'. The locale will be determined by your browser settings. You can change the slug and locale by modifying the URL. For example, to view the experience with the slug of 'about-page' and a locale of 'de', you would navigate to `http://localhost:3000/de/about-page`.

For the localization, this app uses the built in [i18n](https://nextjs.org/docs/pages/building-your-application/routing/internationalization) routing of Next.js. You can configure locales by adding them to the `i18n` section in the `next.config.mjs` file.
