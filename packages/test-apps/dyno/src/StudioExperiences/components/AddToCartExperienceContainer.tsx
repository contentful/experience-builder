import { detachExperienceStyles } from '@contentful/experiences-sdk-react';
import { getExperience } from '@/utils/getExperience';
import { Experience } from './Experience';

type AddToCartProps = {
  isEditorMode?: boolean;
  isPreviewMode?: boolean;
  locale?: string;
};

export default async function AddToCartExperienceContainer({
  isPreviewMode = false,
  isEditorMode = false,
  locale = 'en-US',
}: AddToCartProps) {
  const slug = 'hackathon-dyno';
  const { experience, error } = await getExperience(slug, locale, isPreviewMode, isEditorMode);

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
