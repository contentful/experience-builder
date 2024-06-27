import { getExperience } from '@/getExperience';
import { ExperienceRoot, detachExperienceStyles } from '@contentful/experiences-sdk-react';

type Page = {
  params: { locale?: string; slug?: string; preview?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ExperiencePage({ params, searchParams }: Page) {
  const { locale = 'en-US', slug = 'home-page' } = params || {};
  const { isPreview, expEditorMode } = searchParams;
  const preview = isPreview === 'true';
  const editorMode = expEditorMode === 'true';
  const { experience, error } = await getExperience(slug, locale, preview, editorMode);

  if (error) {
    return <div>{error.message}</div>;
  }

  // extract the styles from the experience
  const stylesheet = detachExperienceStyles(experience!);

  // experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;
  return (
    <main style={{ width: '100%' }}>
      {stylesheet && <style>{stylesheet}</style>}
      <ExperienceRoot experience={experienceJSON} locale={locale} />
    </main>
  );
}
