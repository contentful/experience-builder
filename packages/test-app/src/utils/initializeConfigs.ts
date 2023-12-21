import { ContentfulConfig } from './models';

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
          window.localStorage['contentful-configs']
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
