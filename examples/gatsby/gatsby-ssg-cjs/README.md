# Studio Experiences with Gatsby static site generation rendering example running with CommonJS

This example demonstrates how to use [Gatsby](https://www.gatsbyjs.com/) to create a server rendered page with Studio Experiences.


[!IMPORTANT]
This example is a clone of the gatsby-ssg example but without the need of writing server side code as ES modules. Note that we strongly recommend to use ESM instead of CJS. Only for legacy projects that cannot upgrade to ESM, we present this alternative approach. Since the official SDK at `@contentful/experiences-sdk-react` doesn't provide a CJS export, this example imports the required functions directly from the internal core package which provides a CJS export starting with version `3.7.0`. However, we might drop the CJS support again at a future point.

## Getting started

Before you begin, you should already have a Contentful space with Studio Experiences enabled and configured. If you do not yet have a space, please contact your Contentful account representative.

1. Clone the repo and install the app

To get started with this example, clone the repo, go into the examples/gatsby/gatsby-ssg directory, and install the app:

```bash
npm install
```

2. Set up your environment variables

Next, set up your environment variables. Copy the `.env.development.example` file to `.env.development` and fill in the following variables:

- GATSBY_CTFL_SPACE: This is the Space ID of your Contentful space. This can be found in Settings>General Settings.
- GATSBY_CTFL_ACCESS_TOKEN: This is the Content Delivery API access token, which is used for fetching published data from your Contentful space. This can be found in Settings>API Keys.
- GATSBY_CTFL_PREVIEW_ACCESS_TOKEN: This is the Content Preview API access token, which is used for fetching draft data from your Contentful space. This can be found in Settings>API Keys.
- GATSBY_CTFL_ENVIRONMENT: This is the environment of your Contentful space. This can be found in Settings>General Settings. This can be found in Settings>Environments.
- GATSBY_CTFL_EXPERIENCE_TYPE= This is the content type id of the Experience content type in your Contentful space. This can be found in Content Model>Experience.

3. Verify the setup in **gatsby-node.ts** file

The **gatsby-node.ts** file is configured to pull down all Experience content types (based on your `GATSBY_CTFL_EXPERIENCE_TYPE` environment variable) and create a page for each Experience. You might need to tweak this file to match your needs.

[!NOTE]
We're using `.js` files in this example but you can use TypeScript as instructed in the [official documentation by Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript).

4. Start the development server

Now that you have set up your environment variables, you can start the development server:

```bash
npm run start
```

The app is set up to run on `http://localhost:8000`. By default, the root URL will pull up an experience with the slug of 'home-page'. The locale will be determined by your browser settings.

[!NOTE]
Since all the Experience pages are generated at build time, you will need to run `npm run build` or `npm run start` to see the changes in the Experience pages or when adding new ones.

5. Production build

When creating a production build, the environment variables will be loaded from `.env.production`.

```bash
npm run build
```