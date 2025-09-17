// import './studio-config';
import { initStudioConfig } from './studio-config-imperative';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles.css';
import { ExperienceRoot, useFetchBySlug } from '@contentful/experiences-sdk-react';
import { useContentfulClient } from './hooks/useContentfulClient';
import { useContentfulConfig } from './hooks/useContentfulConfig';
import { fetchAdditionalLevels } from './utils/earlyPreload';
import { StudioCanvasMode } from '@contentful/experiences-core/constants';
import ColorfulBox from './components/ColorfulBox/ColorfulBox';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

type Posts = Post[];

export default function Page() {
  const { slug = 'home-page', locale } = useParams<{ slug: string; locale?: string }>();
  const localeCode = locale ?? 'en-US';
  const { config } = useContentfulConfig();
  const { client } = useContentfulClient();

  const [externalParamLoadingState, setExternalParamLoadingState] = useState<
    'before-loading' | 'loading' | 'finished_loading'
  >('before-loading');

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
      return;
    }
    if (experienceLoadingError) {
      return;
    }

    if (!experience) {
      // if we got past isLoading and experienceLoadingError checks, but experience is still undefined,
      // this means that we are in EDITOR mode (not Preview+Delivery mode).
      return;
    }

    if (areAllAdditionalLevelsFetched) {
      return;
    }

    async function earlyPreload(experience: Parameters<typeof fetchAdditionalLevels>[1]) {
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
    earlyPreload(experience);
  }, [
    experience,
    isLoading,
    experienceLoadingError,
    mode,
    areAllAdditionalLevelsFetched,
    client,
    localeCode,
  ]);

  useEffect(() => {
    async function loadExternalParam() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error(`Error making third party api call`);
        }
        const posts = (await response.json()) as Posts;
        const titles = posts.map((post) => post.title);

        // after loading external titles, I can call imperatively initialize studio
        initStudioConfig([
          {
            component: ColorfulBox,
            definition: {
              id: 'colbox-with-dynamic-options',
              name: 'Colorful box with dynamic options',
              variables: {
                myTitleOption: {
                  type: 'Text',
                  description: 'Select dynamically loaded names from the list',
                  // group: 'content', // doesn't show up for content only for style
                  group: 'style',
                  defaultValue: 'na',
                  validations: {
                    in: [
                      { value: 'na', displayName: 'N/A' },
                      ...titles.map((t) => ({ value: t, displayName: t })),
                    ],
                  },
                },
              },
            },
          },
        ]);
      } finally {
        setExternalParamLoadingState('finished_loading');
      }
    }

    if (externalParamLoadingState === 'before-loading') {
      setExternalParamLoadingState('loading');
      loadExternalParam();
    }
  }, [externalParamLoadingState]);

  const shouldShowBannerAboutLoadingAdditionalLevels =
    mode === StudioCanvasMode.NONE && !areAllAdditionalLevelsFetched;

  if (isLoading) return <div>Loading...</div>;

  if (experienceLoadingError) return <div>{experienceLoadingError.message}</div>;

  if (externalParamLoadingState === 'before-loading' || externalParamLoadingState === 'loading')
    return <div>Loading external parameter...</div>;

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
