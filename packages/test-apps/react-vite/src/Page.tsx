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

  const { experience, error, isLoading } = useFetchBySlug({
    slug,
    localeCode,
    client,
    experienceTypeId: config.experienceTypeId,
    hyperlinkPattern: '/{entry.fields.slug}',
  });

  // techincally here I should be able to start loading additional levels...
  useEffect(
    function ƒFetchAdditional() {
      if (!experience) {
        console.warn(
          ';;[effectFetchAdditional] Experience not loaded yet, cannot fetch additional levels',
        );
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
    [experience, areAllAdditionalLevelsFetched, client, localeCode],
  );

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return <ExperienceRoot experience={experience} locale={localeCode} />;
}
