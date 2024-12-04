import { getExperience } from '@/utils/getExperience';
import { ExperienceRoot } from '@contentful/experiences-sdk-nextjs';
import '@/studio-config';

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

  return (
    <main style={{ width: '100%' }}>
      <ExperienceRoot experience={experience} locale={locale} searchParams={searchParams} />;
    </main>
  );
}
