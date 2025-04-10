import Experience from '@/components/Experience';
import { getExperience } from '@/utils/getExperience';
import { detachExperienceStyles } from '@contentful/experiences-sdk-react';
import '../../studio-config';

type Page = {
  params: { locale?: string; slug?: string; preview?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ExperiencePage({ params, searchParams }: Page) {
  const { slug = 'home-page' } = params || {};
  const { isPreview, expEditorMode, mode, locale = 'en-US' } = searchParams;
  const preview = isPreview === 'true' || mode === 'preview';
  const editorMode = expEditorMode === 'true';
  const { experience, error } = await getExperience(slug, locale as string, preview, editorMode);

  if (error) {
    return <div>{error.message}</div>;
  }

  const stylesheet = experience ? detachExperienceStyles(experience) : null;

  // experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;

  return (
    <main style={{ width: '100%' }}>
      {stylesheet && <style data-css-ssr>{stylesheet}</style>}
      <Experience experienceJSON={experienceJSON} locale={locale as string} debug={true} />
    </main>
  );
}
