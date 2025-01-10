import React from 'react';
import ReactMarkdown from 'react-markdown';

const markdownContent = `
## 🚀 Enabling Gatsby with Experiences 

1. **Update env.development.example for useContentfulClient.ts**

   Go to \`.env.development.example\` and fill out the following fields and rename the file to \`.env.development\`

   \`\`\`
   GATSBY_CTFL_ENVIRONMENT=
   GATSBY_CTFL_SPACE=
   GATSBY_CTFL_ACCESS_TOKEN=
   GATSBY_CTFL_PREVIEW_ACCESS_TOKEN=
   GATSBY_CTFL_EXPERIENCE_TYPE=
   GATSBY_CTFL_DOMAIN=
   \`\`\`

2. **Create the Experience in the Contentful Experiences UI**

   In the settings tab of Experiences, set a Title and Slug. Then go to the content preview URL settings and under \`Preview URL for Experiences (required)\` set the value to be \`http://localhost:8000/{locale}/{entry.fields.slug}?isPreview=true\`.

3. **Make edits to the Experience UI Canvas**

   Feel free to add containers, buttons, and headers to the page! Then save and publish your changes.

4. **Understanding how it's connected**

   Go to \`gatsby-browser.tsx\` and notice how the \`StudioExperiencePage\` component is already hooked up to a route with the localeCode and slug, and how that matches your \`Preview URL for Experiences\`. Then, when inspecting the \`StudioExperiencePage\` component, you can see the path params are pulled out and it calls \`useFetchBySlug\`, which will fetch the correct Experience based on your slug (which acts as a unique ID for the experience) and renders the experience in your web application for the given path that is defined in \`gatsby-browser.tsx\`.
`;

export default function Index() {
  return (
    <>
      <section>
        <h1>Studio Experiences with Gatsby single page application example</h1>
        <div
          style={{
            margin: '20px 0',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre',
          }}
        >
          <h4>{`Click `}</h4>
          <a
            href="http://localhost:8000/en-US/StudioExperiencePage?isPreview=true"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          <h4>{` when the Gatsby project is hooked up with Experiences and the Experience is published after following the README.`}</h4>
        </div>
      </section>
      <section>
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </section>
    </>
  );
}
