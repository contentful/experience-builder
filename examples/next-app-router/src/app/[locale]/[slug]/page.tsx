import Experience from '@/components/Experience';
import { getExperience } from '@/getExperience';
import { detachExperienceStyles } from '@contentful/experiences-sdk-react';
// import the studio config server side
import '@/studio-config';

type Page = {
  params: Promise<{ locale?: string; slug?: string; preview?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ExperiencePage({ params, searchParams }: Page) {
  const { locale = 'en-US', slug = 'home-page' } = (await params) || {};
  const { isPreview, expEditorMode } = await searchParams;
  const preview = isPreview === 'true';
  const editorMode = expEditorMode === 'true';
  const { experience, error } = await getExperience(slug, locale, preview, editorMode);

  if (error) {
    return <div>{error.message}</div>;
  }

  // extract the styles from the experience
  const stylesheet = experience ? detachExperienceStyles(experience) : null;

  // experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;
  return (
    <main style={{ width: '100%' }}>
      {stylesheet && <style>{stylesheet}</style>}
      <Experience experienceJSON={experienceJSON} locale={locale} />
    </main>
  );
}
