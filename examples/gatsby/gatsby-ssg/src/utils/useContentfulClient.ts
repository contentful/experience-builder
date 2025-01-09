
import { useMemo } from 'react';
import { createClient } from 'contentful';

export const useContentfulClient = () => {
  const isPreview = false; // Update to dynamically grab from query params in the URL 

  const client = useMemo(() => {
    const clientConfig = {
      space: process.env.GATSBY_CTFL_SPACE || 'son9ld5ewssk',
      environment: process.env.GATSBY_CTFL_ENVIRONMENT || 'master',
      host: isPreview ? `preview.${process.env.GATSBY_CTFL_DOMAIN}` || 'cdn.contentful.com' : `cdn.${process.env.GATSBY_CTFL_DOMAIN}` || 'cdn.contentful.com',
      accessToken: isPreview ? process.env.GATSBY_CTFL_PREVIEW_ACCESS_TOKEN || 'kHi665AtkIuAWgln1xbsf_jvoMPva4AsK62hff0_lio': process.env.GATSBY_CTFL_ACCESS_TOKEN || 'jqD43tJfgQG9Djsrlp9IcpxJepE416qmOdaemfzoxnE',
      experienceTypeId: process.env.GATSBY_CTFL_EXPERIENCE_TYPE || 'hostedLayout',
    };
    return createClient(clientConfig);
  }, []);

  return { client };
};
