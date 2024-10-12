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
  // While in editor mode, the experience is passed to the ExperienceRoot
  // component by the editor, so we don't fetch it here
  if (isEditorMode) {
    return { experience: undefined, error: undefined };
  }

  const client = getConfig(isPreview);
  let experience: Awaited<ReturnType<typeof fetchBySlug>> | undefined;

  try {
    experience = await fetchBySlug({
      client,
      slug,
      experienceTypeId,
      localeCode,
    });
  } catch (error) {
    return { experience, error: error as Error };
  }
  return { experience, error: undefined };
};

export type ExperienceType = Awaited<ReturnType<typeof fetchBySlug>>;