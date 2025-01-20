import { useMemo } from 'react';
import { createClient } from 'contentful';
import '../studio-config'; // Update this file to set breakpoints, design tokens, and register components

type Props = {
  isPreview?: boolean;
}

export const useContentfulClient = ({isPreview}: Props) => {
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
