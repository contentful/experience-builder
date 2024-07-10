import { detachExperienceStyles } from '@contentful/experiences-sdk-react';
import { Experience } from '@/StudioExperiencesComponents/Experience';
import { getExperience } from '@/utils/getExperience';

type Page = {
  params: { locale?: string; slug?: string; preview?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * This page only exists to render this app within Contentful Studio Experiences.
 * This page should never recieve any real traffic in prodcution environments.
 *
 * Honestly, we might even want to hard-code 'editorMode' to true, and 'previewMode'
 * to false. tbd.
 */
export default async function HackathonDynoPage({ params, searchParams }: Page) {
  const { locale = 'en-US', slug = 'hackathon-dyno' } = params || {};
  const { isPreview, expEditorMode } = searchParams;
  const preview = isPreview === 'true';
  const editorMode = expEditorMode === 'true';
  const { experience, error } = await getExperience(slug, locale, preview, editorMode);

  if (error) {
    return <div>{error.message}</div>;
  }

  const stylesheet = experience ? detachExperienceStyles(experience) : null;

  //experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;

  return (
    <main style={{ width: '100%' }}>
      {stylesheet && <style data-css-ssr>{stylesheet}</style>}
      <Experience experienceJSON={experienceJSON} localeCode={locale} />
    </main>
  );
}
