import Experience from '@/components/Experience';
import { getExperience, getConfig as createClientWithConfig } from '@/utils/getExperience';
import { detachExperienceStyles } from '@contentful/experiences-sdk-react';
import '../../studio-config';
import { fetchAdditionalLevels } from '@/utils/earlyPreload';

type Page = {
  params: { slug?: string | string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ExperiencePage({ params, searchParams }: Page) {
  const { slug: slugSegments } = params || {};
  const { localeCode, slug } = extractLocaleCodeAndSlug(slugSegments);
  const { isPreview, expEditorMode, mode } = searchParams;
  const preview = isPreview === 'true' || mode === 'preview';
  const editorMode = expEditorMode === 'true';
  const { experience, error } = await getExperience(slug, localeCode, preview, editorMode);

  const client = createClientWithConfig(preview);

  if (error) {
    return <div>{error.message}</div>;
  }

  if (experience) {
    // experience is loaded by getExperience() because it is in Preview+Delivery mode,
    // when it EDITOR+READ_ONLY mode, it return undefined, as experience would be postMessage'd from the Studio.
    await fetchAdditionalLevels(3, experience, localeCode, client);
  }

  const stylesheet = experience ? detachExperienceStyles(experience) : null;

  // experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;

  return (
    <main style={{ width: '100%' }}>
      {stylesheet && <style data-css-ssr>{stylesheet}</style>}
      <Experience experienceJSON={experienceJSON} locale={localeCode} debug={true} />
    </main>
  );
}

/**
 * Supported paths:
 *
 * - "/" => `{ localeCode: 'en-US', slug: 'home-page' }`
 * - "/experience-slug" => `{ localeCode: 'en-US', slug: 'experience-slug' }`
 * - "/de-DE/experience-slug" => `{ localeCode: 'de-DE', slug: 'experience-slug' }`
 * - "/it-IT/some/nested/experience" => `{ localeCode: 'it-IT', slug: 'some/nested/experience' }`
 */
const extractLocaleCodeAndSlug = (slugSegments: Page['params']['slug']) => {
  if (!slugSegments || slugSegments.length === 0) {
    return { localeCode: 'en-US', slug: 'home-page' };
  }
  if (!Array.isArray(slugSegments)) {
    return { localeCode: 'en-US', slug: slugSegments || 'home-page' };
  }
  if (slugSegments.length == 1) {
    return { localeCode: 'en-US', slug: slugSegments[0] || 'home-page' };
  }
  return {
    localeCode: slugSegments[0] || 'en-US',
    slug: slugSegments.slice(1).join('/') || 'home-page',
  };
};
