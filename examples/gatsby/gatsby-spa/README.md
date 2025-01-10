# Studio Experiences with Gatsby single page application example

## 🚀 Enabling Gatsby with Experiences 
1. **Update env.development.example for useContentfulClient.ts**

Go to `.env.development.example` and fill out the following fields and rename the file to `.env.development`

```
  GATSBY_CTFL_ENVIRONMENT=
  GATSBY_CTFL_SPACE=
  GATSBY_CTFL_ACCESS_TOKEN=
  GATSBY_CTFL_PREVIEW_ACCESS_TOKEN=
  GATSBY_CTFL_EXPERIENCE_TYPE=
  GATSBY_CTFL_DOMAIN=
```

2. **Create the Experience in the Contentful Experienecs UI**

In the settings tab of Experiences, set a Title and Slug. Then go the to content preview url settings and under `Preview URL for Experiences(required)` set the value to be http://localhost:8000/{locale}/{entry.fields.slug}?isPreview=true

3. **Make edits to the Experience UI Canvas**
Feel free to add containers, buttons, and headers to the page! Then save and publish your changes.

4. **Understanding how it's connected**

Go to `gatsby-browser.tsx` and notice how the `StudioExperiencePage` component is already hooked up to a route with the localeCode and slug and how that matches your `Preview URL for Experiences`. Then when inspecting the `StudioExperiencePage` component, you can see the path params are pulled out and calls `useFetchBySlug` which will fetch the correct Experience based on your slug which acts as an unique id for the experience and render the experience in your web application for the given path that is defined in `gatsby-browser.tsx`.

## 🚀 Quick start

1.  **Create a Gatsby site.**

    Use the Gatsby CLI to create a new site, specifying the minimal TypeScript starter.

    ```shell
    # create a new Gatsby site using the minimal TypeScript starter
    npm init gatsby -- -ts
    ```

2.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd my-gatsby-site/
    npm run develop
    ```

3.  **Open the code and start customizing!**

    Your site is now running at http://localhost:8000!

    Edit `src/pages/index.tsx` to see your site update in real-time!

4.  **Learn more**

    - [Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Tutorials](https://www.gatsbyjs.com/docs/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Guides](https://www.gatsbyjs.com/docs/how-to/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
    - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)
