import { createClient } from 'contentful';

export const getConfig = (isPreview = false) => {
  const accessToken = process.env.NEXT_PUBLIC_CTFL_ACCESS_TOKEN!;
  const prevAccessToken = process.env.NEXT_PUBLIC_CTFL_PREVIEW_ACCESS_TOKEN!;
  const space = process.env.NEXT_PUBLIC_CTFL_SPACE_ID!;
  const environment = process.env.NEXT_PUBLIC_CTFL_ENV_ID!;
  const experienceTypeId = process.env.NEXT_PUBLIC_CTFL_EXPERIENCE_TYPE_ID!;
  const domain = process.env.NEXT_PUBLIC_CTFL_DOMAIN;

  const client = createClient({
    space,
    environment,
    accessToken: isPreview ? prevAccessToken : accessToken,
    host: isPreview ? `preview.${domain}` : `cdn.${domain}`,
  });
  return { client, isPreview, experienceTypeId };
};
