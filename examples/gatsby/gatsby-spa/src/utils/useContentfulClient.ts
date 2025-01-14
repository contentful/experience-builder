import { useMemo } from 'react';
import { createClient } from 'contentful';
import { useLocation } from 'react-router';
import '../studio-config'; // Update this file to set breakpoints, design tokens, and register components

export const useContentfulClient = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isPreview = queryParams.get('isPreview') === 'true';

  const client = useMemo(() => {
    const clientConfig = {
      space: process.env.GATSBY_CTFL_SPACE || '',
      environment: process.env.GATSBY_CTFL_ENVIRONMENT || '',
      host: isPreview
        ? `preview.${process.env.GATSBY_CTFL_DOMAIN}` || 'preview.contentful.com'
        : `cdn.${process.env.GATSBY_CTFL_DOMAIN}` || 'cdn.contentful.com',
      accessToken: isPreview
        ? process.env.GATSBY_CTFL_PREVIEW_ACCESS_TOKEN || ''
        : process.env.GATSBY_CTFL_ACCESS_TOKEN || '',
      experienceTypeId: process.env.GATSBY_CTFL_EXPERIENCE_TYPE || '',
    };
    return createClient(clientConfig);
  }, []);

  return { client };
};
