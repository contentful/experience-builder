import { useMemo } from 'react';
import { createClient } from 'contentful';

export const useContentfulClient = () => {
  const client = useMemo(() => {
    const clientConfig = {
      space: '',
      environment: '',
      host: 'cdn.contentful.com',
      accessToken: '',
      experienceTypeId: '',
    };
    return createClient(clientConfig);
  }, []);

  return { client };
};
