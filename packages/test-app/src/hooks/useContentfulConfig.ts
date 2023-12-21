import { useContext } from 'react';
import { ContentfulConfigProviderContext } from '../utils/ContentfulConfigProvider';
import { ExternalSDKMode } from '@contentful/experience-builder';

export const useContentfulConfig = () => {
  const context = useContext(ContentfulConfigProviderContext)!;
  const currentConfig = context.currentConfig!;
  const config = context.availableConfigs[currentConfig];
  const availableConfigs = context.availableConfigs;
  const isPreview = context.isPreview;
  const mode = isPreview ? 'preview' : 'delivery';

  return {
    availableConfigs: Object.keys(availableConfigs).map((key) => key),
    currentConfig,
    config,
    mode: mode as ExternalSDKMode,
    isPreview,
    setConfig: context.setCurrentConfig,
    setIsPreview: context.setIsPreview,
  };
};
