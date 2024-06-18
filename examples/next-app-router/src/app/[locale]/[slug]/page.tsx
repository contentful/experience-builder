import { getExperience } from '@/getExperience';
import Experience from '@/components/Experience';
import { detachExperienceStyles } from '@contentful/experiences-sdk-react';
import { headers } from 'next/headers';

type Page = {
  params: { locale?: string; slug?: string; preview?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ExperiencePage({ params, searchParams }: Page) {
  const headersList = headers();
  console.log({ params });
  const { locale = 'en-US', slug = 'home-page' } = params || {};
  console.log({ locale });
  const { preview = 'false', editor = 'false' } = searchParams;
  const isPreview = preview === 'true';
  const isEditorMode = editor === 'true';
  const { experience, error } = await getExperience(slug, locale!, isPreview, isEditorMode);

  if (error) {
    return <div>{error.message}</div>;
  }

  const stylesheet = detachExperienceStyles(experience!);

  //experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;

  return (
    <main style={{ width: '100%' }}>
      {/* Look into using Draft Mode here */}
      <Experience experienceJSON={experienceJSON} locale={locale} stylesheet={stylesheet} />
    </main>
  );
}
