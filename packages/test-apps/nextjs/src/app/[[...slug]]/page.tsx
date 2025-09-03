import Experience from '@/components/Experience';
import { getExperience, getConfig as createClientWithConfig } from '@/utils/getExperience';
import { detachExperienceStyles } from '@contentful/experiences-sdk-react';
import '../../studio-config';
import { fetchAdditionalLevels } from '@/utils/earlyPreload';

type Page = {
  params: { locale?: string; slug?: string; preview?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ExperiencePage({ params, searchParams }: Page) {
  const { locale = 'en-US', slug = 'home-page' } = params || {};
  const { isPreview, expEditorMode, mode } = searchParams;
  const preview = isPreview === 'true' || mode === 'preview';
  const editorMode = expEditorMode === 'true';
  const desconstructedSlug = Array.isArray(slug) ? slug.pop() : slug;
  const { experience, error } = await getExperience(
    desconstructedSlug,
    locale,
    preview,
    editorMode,
  );

  const client = createClientWithConfig(preview);

  if (error) {
    return <div>{error.message}</div>;
  }

  if (experience) {
    // experience is loaded by getExperience() because it is in Preview+Delivery mode,
    // when it EDITOR+READ_ONLY mode, it return undefined, as experience would be postMessage'd from the Studio.
    await fetchAdditionalLevels(3, experience, locale, client);
  }

  const stylesheet = experience ? detachExperienceStyles(experience) : null;

  // experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;

  return (
    <main style={{ width: '100%' }}>
      {stylesheet && <style data-css-ssr>{stylesheet}</style>}
      <Experience experienceJSON={experienceJSON} locale={locale} debug={true} />
    </main>
  );
}
