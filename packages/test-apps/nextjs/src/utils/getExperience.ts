import { fetchBySlug, inMemoryEntities } from '@contentful/experiences-sdk-react';
import { createClient } from 'contentful';

const accessToken = process.env.NEXT_PUBLIC_CTFL_ACCESS_TOKEN!;
const prevAccessToken = process.env.NEXT_PUBLIC_CTFL_PREVIEW_ACCESS_TOKEN!;
const space = process.env.NEXT_PUBLIC_CTFL_SPACE!;
const environment = process.env.NEXT_PUBLIC_CTFL_ENVIRONMENT!;
const experienceTypeId = process.env.NEXT_PUBLIC_CTFL_EXPERIENCE_TYPE!;
const domain = process.env.NEXT_PUBLIC_CTFL_DOMAIN || 'contentful.com';

let singletonClient: ReturnType<typeof createClient> | undefined;

export const getSingletonClient = () => {
  if (!singletonClient) {
    singletonClient = getClient(false);
  }
  return singletonClient;
};

const getClient = (isPreview: boolean) => {
  const client = createClient({
    space,
    environment,
    accessToken: isPreview ? prevAccessToken : accessToken,
    host: isPreview ? `preview.${domain}` : `cdn.${domain}`,
  });

  singletonClient = client;
  return client;
};

export const getExperience = async (
  slug: string,
  localeCode: string,
  isPreview = false,
  isEditorMode = false,
) => {
  const client = getClient(isPreview);
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
