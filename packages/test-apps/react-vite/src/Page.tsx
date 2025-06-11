import './studio-config';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles.css';
import { ExperienceRoot, useFetchBySlug } from '@contentful/experiences-sdk-react';
import { useContentfulClient } from './hooks/useContentfulClient';
import { useContentfulConfig } from './hooks/useContentfulConfig';
import { fetchAdditionalLevels } from './utils/earlyPreload';
import { StudioCanvasMode } from '@contentful/experiences-core/constants';

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
    mode,
  } = useFetchBySlug({
    slug,
    localeCode,
    client,
    experienceTypeId: config.experienceTypeId,
    hyperlinkPattern: '/{entry.fields.slug}',
  });

  // This effect is used to fetch additional levels early
  useEffect(() => {
    if (isLoading) {
      console.warn(';;[effectFetchAdditional] Experience is still loading...');
      return;
    }
    if (experienceLoadingError) {
      console.error(';;[effectFetchAdditional] Error loading experience:', experienceLoadingError);
      return;
    }

    if (!experience) {
      console.warn(';;[effectFetchAdditional] Experience is falsy');
      return;
    }

    if (areAllAdditionalLevelsFetched) {
      console.warn(';;[effectFetchAdditional] All additional levels already fetched, skipping');
      return;
    }

    async function earlyPreload() {
      try {
        await fetchAdditionalLevels(3, experience, localeCode, client);
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Adding delay, for demonstration in the UI that we are loading something extra
        setAreAllAdditionalLevelsFetched(true);
      } catch (error) {
        // you can decide yourself how to handle failed loading
        console.error('Error fetching additional levels:', error);
        throw error;
      }
    }
    earlyPreload();
    return () => {
      console.warn(';;[effectFetchAdditional] Effect cleanup.');
    };
  }, [
    experience,
    isLoading,
    experienceLoadingError,
    mode,
    areAllAdditionalLevelsFetched,
    client,
    localeCode,
  ]);

  const shouldShowBannerAboutLoadingAdditionalLevels =
    mode === StudioCanvasMode.NONE && !areAllAdditionalLevelsFetched;

  if (isLoading) return <div>Loading...</div>;

  if (experienceLoadingError) return <div>{experienceLoadingError.message}</div>;

  return (
    <>
      {!shouldShowBannerAboutLoadingAdditionalLevels ? null : (
        <h3
          style={{
            background: 'black',
            color: 'white',
            position: 'fixed',
            left: '0',
            top: '0',
            width: '100%',
            margin: '0',
            padding: '16px',
          }}>
          Loading additional levels... <sup>(won't trigger on hot-reload)</sup>
        </h3>
      )}
      <ExperienceRoot experience={experience} locale={localeCode} />
    </>
  );
}
