import './eb-config';
import { useParams } from 'react-router-dom';
import './styles.css';
import { ExperienceRoot, useFetchBySlug } from '@contentful/experiences-sdk-react';
import { EntityStore } from '@contentful/experiences-core';

import { useContentfulClient } from './hooks/useContentfulClient';
import { useContentfulConfig } from './hooks/useContentfulConfig';

// TODO: This must match your entry
const SITE_CONFIG_CONTENT_TYPE_ID = 'siteConfig';

export default function Page() {
  const { slug = 'homePage' } = useParams<{ slug: string }>();
  const localeCode = 'en-US';
  const { config } = useContentfulConfig();
  const { client } = useContentfulClient();

  const detectThemeColorFromExperience = (entityStore: EntityStore): string | undefined => {
    const siteConfigEntry = entityStore.entities.find((entity) => {
      if (entity.sys.type === 'Asset') return false;
      if (entity.sys.contentType.sys.id === SITE_CONFIG_CONTENT_TYPE_ID) {
        return true;
      }
      return false;
    });

    if (!siteConfigEntry) {
      return undefined;
    }

    const siteConfigFields = siteConfigEntry.fields as {
      // TODO: this must match the shape of your "site configuratoin" Content Type
      themeColor: string;
      name: string;
    };
    const themeColor = siteConfigFields.themeColor;
    return themeColor;
  };

  const { experience, error, isLoading } = useFetchBySlug({
    slug,
    localeCode,
    client,
    experienceTypeId: config.experienceTypeId,
    hyperlinkPattern: '/{entry.fields.slug}',
  });

  const isInIframe = window.self !== window.top;
  const isProbablyInEditorMode = isInIframe;

  if (isProbablyInEditorMode) {
    if (isLoading) return <div>Loading in editor mode...</div>;

    if (error) return <div>{error.message}</div>;
    return <ExperienceRoot experience={experience} locale={localeCode} />;
  } else {
    // In Production+Delivery mode
    //
    const isStillLoadingEntityStore = isLoading || !experience?.entityStore;
    if (isStillLoadingEntityStore) return <div>Loading in production + delivery mode...</div>;

    if (error) return <div>{error.message}</div>;

    console.log(
      `;Experience after isStillLoading(${isStillLoadingEntityStore})==false, has experience.entityStore set `,
      experience,
    );

    const themeColor = detectThemeColorFromExperience(experience.entityStore!);

    if ('red' === themeColor) {
      return (
        <div style={{ backgroundColor: 'red', padding: '16px' }}>
          <ExperienceRoot experience={experience} locale={localeCode} />
        </div>
      );
    } else if ('yellow' === themeColor) {
      return (
        <div style={{ backgroundColor: 'yellow', padding: '16px' }}>
          <ExperienceRoot experience={experience} locale={localeCode} />
        </div>
      );
    } else {
      // no theme
      return <ExperienceRoot experience={experience} locale={localeCode} />;
    }
  }
}
