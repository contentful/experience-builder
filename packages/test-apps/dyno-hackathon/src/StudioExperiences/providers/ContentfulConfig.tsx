import { createContext, useState } from 'react';
import { ContentfulConfig } from '../../types';

export function initializeConfigs() {
  const envAccessToken = import.meta.env.VITE_CTFL_ACCESS_TOKEN;
  const envPreviewToken = import.meta.env.VITE_CTFL_PREVIEW_ACCESS_TOKEN;
  const envSpaceId = import.meta.env.VITE_CTFL_SPACE;
  const envEnvironment = import.meta.env.VITE_CTFL_ENVIRONMENT;
  const envDomain = import.meta.env.VITE_CTFL_DOMAIN;
  const envExperienceTypeId = import.meta.env.VITE_CTFL_EXPERIENCE_TYPE;

  const hasAllEnvVars = !!(
    envAccessToken &&
    envPreviewToken &&
    envSpaceId &&
    envEnvironment &&
    envDomain &&
    envExperienceTypeId
  );

  if (!window.localStorage['contentful-configs']) {
    if (hasAllEnvVars) {
      const baseConfigs = {
        envFile: {
          accessToken: envAccessToken,
          previewToken: envPreviewToken,
          space: envSpaceId,
          domain: envDomain,
          environment: envEnvironment,
          experienceTypeId: envExperienceTypeId,
        },
      };
      window.localStorage['contentful-configs'] = JSON.stringify(baseConfigs);

      if (!window.localStorage['contentful-current-config']) {
        const baseConfigs: Record<string, ContentfulConfig> = JSON.parse(
          window.localStorage['contentful-configs'],
        );
        window.localStorage['contentful-current-config'] = Object.keys(baseConfigs)[0];
      }
      if (!window.localStorage['contentful-is-preview']) {
        window.localStorage['contentful-is-preview'] = import.meta.env.VITE_MODE || 'true';
      }
    } else {
      const message = `Missing some or all of the required environment variables:
VITE_CTFL_ACCESS_TOKEN
VITE_CTFL_PREVIEW_ACCESS_TOKEN
VITE_CTFL_SPACE
VITE_CTFL_ENVIRONMENT
VITE_CTFL_DOMAIN
VITE_CTFL_EXPERIENCE_TYPE`;
      throw new Error(message);
    }
  }
}

export interface ContentfulConfigProviderProps {
  currentConfig: string;
  availableConfigs: Record<string, ContentfulConfig>;
  isPreview: boolean;
  setCurrentConfig: (config: string) => void;
  setIsPreview: (isPreview: boolean) => void;
}

export const ContentfulConfigProviderContext = createContext<
  ContentfulConfigProviderProps | undefined
>(undefined);

export const ContentfulConfigProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isPreview, setIsPreview] = useState<boolean>(
    window.location.search.includes('isPreview=true') ||
      JSON.parse(window.localStorage['contentful-is-preview']),
  );
  const [currentConfig, setCurrentConfig] = useState<string>(
    window.localStorage['contentful-current-config'],
  );
  const [availableConfigs] = useState<Record<string, ContentfulConfig>>(
    JSON.parse(window.localStorage['contentful-configs']),
  );

  const handleSetIsPreview = (isPreview: boolean) => {
    window.localStorage['contentful-is-preview'] = JSON.stringify(isPreview);
    setIsPreview(isPreview);
    window.location.reload();
  };

  const handleSetCurrentConfig = (config: string) => {
    window.localStorage['contentful-current-config'] = config;
    setCurrentConfig(config);
    window.location.reload();
  };

  return (
    <ContentfulConfigProviderContext.Provider
      value={{
        currentConfig,
        availableConfigs,
        isPreview,
        setCurrentConfig: handleSetCurrentConfig,
        setIsPreview: handleSetIsPreview,
      }}>
      {children}
    </ContentfulConfigProviderContext.Provider>
  );
};
