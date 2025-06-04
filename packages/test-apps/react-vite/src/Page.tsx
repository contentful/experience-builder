import './studio-config';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles.css';
import { ExperienceRoot, useFetchBySlug } from '@contentful/experiences-sdk-react';
import { useContentfulClient } from './hooks/useContentfulClient';
import { useContentfulConfig } from './hooks/useContentfulConfig';
import { fetchAdditionalLevels } from './early-preload/fetchAdditionalLevels';

export default function Page() {
  const { slug = 'home-page', locale } = useParams<{ slug: string; locale?: string }>();
  const localeCode = locale ?? 'en-US';
  const { config } = useContentfulConfig();
  const { client } = useContentfulClient();

  const [areAllAdditionalLevelsFetched, setAreAllAdditionalLevelsFetched] = useState(false);

  const {
    experience,
    error: experienceLoadingError,
    isLoading,
  } = useFetchBySlug({
    slug,
    localeCode,
    client,
    experienceTypeId: config.experienceTypeId,
    hyperlinkPattern: '/{entry.fields.slug}',
  });

  // techincally here I should be able to start loading additional levels...
  useEffect(
    function ƒFetchAdditional() {
      // Due to bug https://contentful.atlassian.net/browse/SPA-2841 this will be false on initial-render
      // and additional checks (like !experience or !experience.entityStore) are needed.
      if (isLoading) {
        console.warn(';;[effectFetchAdditional] Experience is still loading...');
        return;
      }
      if (experienceLoadingError) {
        console.error(
          ';;[effectFetchAdditional] Error loading experience:',
          experienceLoadingError,
        );
        return;
      }

      // Due to https://contentful.atlassian.net/browse/SPA-2841 we cannot rely on `isLoading` and `experienceLoadingError`
      // so we need another way to check if the experience is ready.

      // However, due to another bug https://contentful.atlassian.net/browse/SPA-2842, we cannot rely on `experience` being truthy as
      // signal that the experience is loaded.
      if (!experience) {
        console.warn(';;[effectFetchAdditional] Experience is falsy');
        return;
      }

      // As hack around bugs https://contentful.atlassian.net/browse/SPA-2842
      // Instead of relying on `experience` being truthy, we can rely on `experience.entityStore` being truthy
      // to signal that the experience is loaded.
      if (!experience.entityStore) {
        console.warn(';;[effectFetchAdditional] Experience does not have an entity store');
        return;
      }

      if (areAllAdditionalLevelsFetched) {
        console.warn(';;[effectFetchAdditional] All additional levels already fetched, skipping');
        return;
      }

      async function earlyPreload() {
        try {
          await fetchAdditionalLevels(2, experience, localeCode, client);
          setAreAllAdditionalLevelsFetched(true);
        } catch (error) {
          // what do we handle here?
          console.error('Error fetching additional levels:', error);
          throw error; // rethrow to let the error boundary handle it
        }
      }
      earlyPreload();
      // TODO: how to handle cancelling of the effect?
      return () => {
        console.warn(
          ';;[effectFetchAdditional] Effect cleanup. (wonder why we had to cancel this; probably fetching is in progress)',
        );
      };
    },
    [
      experience,
      isLoading,
      experienceLoadingError,
      areAllAdditionalLevelsFetched,
      client,
      localeCode,
    ],
  );

  if (isLoading) return <div>Loading...</div>;

  if (experienceLoadingError) return <div>{experienceLoadingError.message}</div>;

  return <ExperienceRoot experience={experience} locale={localeCode} />;
}
