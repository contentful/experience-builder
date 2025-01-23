// This file is mjs and not ts because there are errors currently when using `@contentful/experiences-sdk-react` in this file when it's TypeScript.
import { createClient } from 'contentful';
import {
  detachExperienceStyles,
  fetchBySlug,
} from '@contentful/experiences-sdk-react';
import dotenv from 'dotenv';
import path from 'path';
//import studio config so values are available at build time
import './src/studio-config.mjs';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const isPreview = true;
const contentType = process.env.GATSBY_CTFL_EXPERIENCE_TYPE || '';

const clientConfig = {
    space: process.env.GATSBY_CTFL_SPACE || '',
    environment: process.env.GATSBY_CTFL_ENVIRONMENT || '',
    host: isPreview
        ? `preview.${process.env.GATSBY_CTFL_DOMAIN}` || 'preview.contentful.com'
        : `cdn.${process.env.GATSBY_CTFL_DOMAIN}` || 'cdn.contentful.com',
    accessToken: isPreview
        ? process.env.GATSBY_CTFL_PREVIEW_ACCESS_TOKEN || ''
        : process.env.GATSBY_CTFL_ACCESS_TOKEN || '',
    experienceTypeId: contentType,
};
const client = createClient(clientConfig);

export const createPages = async function ({ actions }) {
  const localeCode = 'en-US';

  const entries = await client.getEntries({
    content_type: contentType,
    select: ['fields.slug'],
  });

  for (const item of entries.items) {
    try {
      const { slug } = item.fields || {};
      if (typeof slug !== 'string' || slug === '') {
        console.warn(`Invalid slug found for entry ${item.sys.id}`);
        return;
      }

      const experience = await fetchBySlug({
        client,
        slug,
        experienceTypeId: contentType,
        localeCode,
        isEditorMode: false,
      });
      if (!experience) {
        console.warn(`Experience not found for slug ${slug}`);
        return;
      };
      const stylesheet = detachExperienceStyles(experience);
      actions.createPage({
        path: slug,
        component: path.resolve(`./src/templates/ExperienceTemplate.tsx`),
        context: {
          experienceJson: JSON.stringify(experience),
          stylesheet,
          localeCode,
        },
      });
      console.log(`created page for slug ${slug}`);
    } catch (e) {
      console.warn('Error when fetching experience', e.message);
    }
  }
};
