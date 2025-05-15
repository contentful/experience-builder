import { fetchBySlug } from '@contentful/experiences-sdk-react';
import { createClient } from 'contentful';

const accessToken = process.env.NEXT_PUBLIC_CTFL_ACCESS_TOKEN!;
const prevAccessToken = process.env.NEXT_PUBLIC_CTFL_PREVIEW_ACCESS_TOKEN!;
const space = process.env.NEXT_PUBLIC_CTFL_SPACE!;
const environment = process.env.NEXT_PUBLIC_CTFL_ENVIRONMENT!;
const experienceTypeId = process.env.NEXT_PUBLIC_CTFL_EXPERIENCE_TYPE!;
const domain = process.env.NEXT_PUBLIC_CTFL_DOMAIN || 'contentful.com';

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
