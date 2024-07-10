import { detachExperienceStyles } from '@contentful/experiences-sdk-react';
import { getExperience } from '@/utils/getExperience';
import { Experience } from '@/StudioExperiencesComponents/Experience';

export default async function ShoppingCartExperienceContainer() {
  const locale = 'en-US';
  const slug = 'hackathon-dyno';
  // const { locale = "en-US", slug = "home-page" } = params || {};
  // const { isPreview, expEditorMode } = searchParams;
  const preview = false; // isPreview === "true";
  const editorMode = false; // expEditorMode === "true";
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
