import { fetchBySlug } from '@contentful/experiences-sdk-react';
import {
  AudienceEntryLike,
  AudienceMapper,
  ExperienceEntryLike,
  ExperienceMapper,
} from '@ninetailed/experience.js-utils-contentful';
import { createClient } from 'contentful';

const accessToken = process.env.NEXT_PUBLIC_CTFL_ACCESS_TOKEN!;
const prevAccessToken = process.env.NEXT_PUBLIC_CTFL_PREVIEW_ACCESS_TOKEN!;
const space = process.env.NEXT_PUBLIC_CTFL_SPACE!;
const environment = process.env.NEXT_PUBLIC_CTFL_ENVIRONMENT!;
const experienceTypeId = process.env.NEXT_PUBLIC_CTFL_EXPERIENCE_TYPE!;
const domain = process.env.NEXT_PUBLIC_CTFL_DOMAIN || 'contentful.com';

export const getConfig = (isPreview: boolean) => {
  const client = createClient({
    space,
    environment,
    accessToken: isPreview ? prevAccessToken : accessToken,
    host: isPreview ? `preview.${domain}` : `cdn.${domain}`,
  });
  return client;
};

export async function getAllNinetailedExperiences() {
  const query = {
    content_type: 'nt_experience',
    include: 1,
  };

  const client = getConfig(true);

  const entries = await client.getEntries(query);
  const experiences = entries.items as ExperienceEntryLike[];

  const mappedExperiences = (experiences || [])
    .filter((entry) => ExperienceMapper.isExperienceEntry(entry))
    .map((entry) => ExperienceMapper.mapExperience(entry));

  return mappedExperiences;
}

export async function getAllNinetailedAudiences() {
  const query = {
    content_type: 'nt_audience',
  };

  const client = getConfig(true);

  const entries = await client.getEntries(query);
  const audiences = entries.items as AudienceEntryLike[];

  const mappedAudiences = (audiences || [])
    .filter((entry) => AudienceMapper.isAudienceEntry(entry))
    .map((entry) => AudienceMapper.mapAudience(entry));

  return mappedAudiences;
}

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
