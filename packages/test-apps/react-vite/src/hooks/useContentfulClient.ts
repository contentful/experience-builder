import { useMemo } from 'react';
import { createClient } from 'contentful';
import { useContentfulConfig } from './useContentfulConfig';

export const useContentfulClient = () => {
  const { config, isPreview, mode } = useContentfulConfig();
  const client = useMemo(() => {
    const clientConfig = {
      space: config.space,
      environment: config.environment,
      host: isPreview ? `preview.${config.domain}` : `cdn.${config.domain}`,
      accessToken: isPreview ? config.previewToken : config.accessToken,
      experienceTypeId: config.experienceTypeId,
      mode,
    };
    return createClient(clientConfig);
  }, [config, isPreview, mode]);

  return { client };
};
