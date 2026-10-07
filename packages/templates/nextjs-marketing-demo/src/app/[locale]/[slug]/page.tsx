import PageLayout from '@/components/PageLayout';
import { getExperience } from '@/getExperience';
import { detachExperienceStyles } from '@contentful/experiences-sdk-react';

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
    return <>{error.message}</>;
  }

  // extract the styles from the experience
  const stylesheet = experience ? detachExperienceStyles(experience) : null;

  // experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;
  return <PageLayout stylesheet={stylesheet} experienceJSON={experienceJSON} locale={locale} />;
}
