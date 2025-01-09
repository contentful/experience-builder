# Studio Experiences with Gatsby single page application example

## 🚀 Enabling Gatsby with Experiences 
1. **Update ExperienceSlugExample.tsx**

Go to `ExperienceSlugExample.tsx` and fill out the following two consts

```
const slug = ''
const localeCode = '';
```

2. **Update env.local.example for useContentfulClient.ts**

Go to `.env.development.example` and fill out the following fields and rename the file to `.env.development`

```
  GATSBY_CTFL_ENVIRONMENT=
  GATSBY_CTFL_SPACE=
  GATSBY_CTFL_ACCESS_TOKEN=
  GATSBY_CTFL_PREVIEW_ACCESS_TOKEN=
  GATSBY_CTFL_EXPERIENCE_TYPE=
  GATSBY_CTFL_DOMAIN=
```

3. **Create the Experience in the Contentful Experienecs UI**

In the settings tab of Experiences, ensure that your Slug field matches the slug in step 1. Save your changes and publish to see this Gatsby project hooked up with Contentful Experiences.

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
