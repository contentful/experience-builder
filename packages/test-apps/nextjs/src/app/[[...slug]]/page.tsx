//import Experience from '@/components/ExperienceServer';
// import { getExperience } from '@/utils/getExperience';
//import { detachExperienceStyles } from '@contentful/experiences-sdk-react';
import '../../studio-config';
import ExperienceClient from '@/components/ExperienceClient';

type Page = {
  params: { locale?: string; slug?: string; preview?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ExperiencePage({ params }: Page) {
  const { locale = 'en-US' } = params || {};
  // const { isPreview, expEditorMode } = searchParams;
  // const preview = isPreview === 'true'; // || mode === 'preview';
  // const editorMode = expEditorMode === 'true';
  // const { experience, error } = await getExperience(slug, locale, preview, editorMode);

  // if (error) {
  //   return <div>{error.message}</div>;
  // }

  // const stylesheet = experience ? detachExperienceStyles(experience) : null;

  // // experience currently needs to be stringified manually to be passed to the component
  // const experienceJSON = experience ? JSON.stringify(experience) : null;

  // {stylesheet && <style data-css-ssr>{stylesheet}</style>}
  // <Experience experienceJSON={experienceJSON} locale={locale} />
  return (
    <main style={{ width: '100%' }}>
      <ExperienceClient locale={locale} />
    </main>
  );
}
