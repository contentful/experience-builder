import { fetchBySlug } from '@contentful/experiences-core';
import { createClient } from 'contentful';

const accessToken = process.env.NEXT_PUBLIC_CTFL_ACCESS_TOKEN!;
const prevAccessToken = process.env.NEXT_PUBLIC_CTFL_PREVIEW_ACCESS_TOKEN!;
const space = process.env.NEXT_PUBLIC_CTFL_SPACE_ID!;
const environment = process.env.NEXT_PUBLIC_CTFL_ENV_ID!;
const experienceTypeId = process.env.NEXT_PUBLIC_CTFL_EXPERIENCE_TYPE_ID!;
const domain = process.env.NEXT_PUBLIC_CTFL_DOMAIN;

export const getConfig = (isPreview = true) => {
  const client = createClient({
    space,
    environment,
    accessToken: isPreview ? prevAccessToken : accessToken,
    host: isPreview ? `preview.${domain}` : `cdn.${domain}`,
  });
  return client;
};

export const getExperience = async (slug: string, localeCode: string) => {
  const client = getConfig();
  let experience: any;
  try {
    experience = await fetchBySlug({
      client,
      slug,
      experienceTypeId,
      localeCode,
    });
  } catch (error) {
    console.error(error);
  }
  return experience;
};
