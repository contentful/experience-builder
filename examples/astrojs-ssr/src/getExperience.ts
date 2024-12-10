import { fetchBySlug } from '@contentful/experiences-sdk-react';
import { createClient } from 'contentful';

const accessToken = import.meta.env.CTFL_ACCESS_TOKEN;
const prevAccessToken = import.meta.env.CTFL_PREVIEW_ACCESS_TOKEN;
const space = import.meta.env.CTFL_SPACE;
const environment = import.meta.env.CTFL_ENVIRONMENT;
const experienceTypeId = import.meta.env.CTFL_EXPERIENCE_TYPE;
const domain = import.meta.env.CTFL_DOMAIN || 'contentful.com';

const getConfig = (isPreview: boolean) => {
  const client = createClient({
    space,
    environment,
    accessToken: isPreview ? prevAccessToken : accessToken,
    host: isPreview ? `preview.${domain}` : `cdn.${domain}`,
  });
  return client;
};

export const getExperience = async (
  slug: string,
  localeCode: string,
  isPreview = false,
  isEditorMode = false,
) => {
  const client = getConfig(isPreview);
  try {
    const experience = await fetchBySlug({
      client,
      slug,
      experienceTypeId,
      localeCode,
      isEditorMode,
    });
    return { experience };
  } catch (error) {
    return { experience: undefined, error: error as Error };
  }
};
