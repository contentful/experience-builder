import { useContext } from 'react';
import { ContentfulConfigProviderContext } from '../utils/ContentfulConfigProvider';

export const useContentfulConfig = () => {
  const context = useContext(ContentfulConfigProviderContext)!;
  const currentConfig = context.currentConfig!;
  const config = context.availableConfigs[currentConfig];
  const availableConfigs = context.availableConfigs;
  const isPreview = context.isPreview;

  return {
    availableConfigs: Object.keys(availableConfigs).map((key) => key),
    currentConfig,
    config,
    isPreview,
    setConfig: context.setCurrentConfig,
    setIsPreview: context.setIsPreview,
  };
};
