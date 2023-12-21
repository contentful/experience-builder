import { ContentfulConfig } from './models';

export function initializeConfigs() {
  const envAccessToken = import.meta.env.VITE_ACCESS_TOKEN;
  const envPreviewToken = import.meta.env.VITE_PREVIEW_ACCESS_TOKEN;
  const envSpaceId = import.meta.env.VITE_SPACE_ID;
  const envEnvironment = import.meta.env.VITE_ENVIRONMENT;
  const envDomain = import.meta.env.VITE_DOMAIN;
  const envExperienceTypeId = import.meta.env.VITE_EXPERIENCE_TYPE_ID;

  if (!window.localStorage['contentful-configs']) {
    let baseConfigs: Record<string, ContentfulConfig>;

    // If we have all the required environment variables, we use the environment variables
    if (
      envAccessToken &&
      envPreviewToken &&
      envSpaceId &&
      envEnvironment &&
      envDomain &&
      envExperienceTypeId
    ) {
      baseConfigs = {
        env: {
          accessToken: envAccessToken,
          previewToken: envPreviewToken,
          space: envSpaceId,
          domain: envDomain,
          environment: envEnvironment,
          experienceTypeId: envExperienceTypeId,
        },
      };
    } else {
      baseConfigs = {
        staging: {
          accessToken: 'ZQahPcU5LwgzT5hIpux9bA0Y3Rxc4vLQIqisfuiMFa4',
          previewToken: 'hK2qdFTJGdV9tYcbq3QAenAthrlMe6T-WWpxl538PWo',
          space: '81ib4cnp1lvz',
          domain: 'flinkly.com',
          environment: 'master',
          experienceTypeId: window.location.hostname === 'localhost' ? 'devLayout' : 'hostedLayout',
        },
        production: {
          accessToken: 'w6szP68LQEmVq2QMCla5-X63TJd_Zko3FRy_7tlC9Bk',
          previewToken: 'mj6yPP4BGfrL84v9gvgEyipPHeWyJ1gukfZvGg3W8AY',
          space: 'son9ld5ewssk',
          domain: 'contentful.com',
          environment: 'master',
          experienceTypeId: window.location.hostname === 'localhost' ? 'devLayout' : 'hostedLayout',
        },
      };
    }
    window.localStorage['contentful-configs'] = JSON.stringify(baseConfigs);
  }
  if (!window.localStorage['contentful-current-config']) {
    const baseConfigs: Record<string, ContentfulConfig> = JSON.parse(
      window.localStorage['contentful-configs']
    );
    window.localStorage['contentful-current-config'] = Object.keys(baseConfigs)[0];
  }
  if (!window.localStorage['contentful-is-preview']) {
    window.localStorage['contentful-is-preview'] = import.meta.env.VITE_MODE || 'true';
  }
}
