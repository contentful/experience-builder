
import { useMemo } from 'react';
import { createClient } from 'contentful';

export const useContentfulClient = () => {
  const client = useMemo(() => {
    const clientConfig = {
      space: process.env.GATSBY_CTFL_SPACE || '',
      environment: process.env.GATSBY_CTFL_ENVIRONMENT || '',
      host: 'cdn.contentful.com',
      accessToken: process.env.GATSBY_CTFL_ACCESS_TOKEN || '',
      experienceTypeId: process.env.GATSBY_CTFL_EXPERIENCE_TYPE || '',
    };
    return createClient(clientConfig);
  }, []);

  return { client };
};
