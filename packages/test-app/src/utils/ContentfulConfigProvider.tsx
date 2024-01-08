import { createContext, useState } from 'react';
import { ContentfulConfig } from './models';
import { initializeConfigs } from './initializeConfigs';

initializeConfigs();

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
      JSON.parse(window.localStorage['contentful-is-preview'])
  );
  const [currentConfig, setCurrentConfig] = useState<string>(
    window.localStorage['contentful-current-config']
  );
  const [availableConfigs] = useState<Record<string, ContentfulConfig>>(
    JSON.parse(window.localStorage['contentful-configs'])
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
