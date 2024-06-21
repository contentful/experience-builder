import Experience from '@/components/Experience';
import { getExperience } from '@/utils/getExperience';
import { detachExperienceStyles } from '@contentful/experiences-sdk-react';

type Page = {
  params: { locale?: string; slug?: string; preview?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ExperiencePage({ params, searchParams }: Page) {
  const { locale = 'en-US', slug = 'home-page' } = params || {};
  const { preview = 'false' } = searchParams;
  const isPreview = preview === 'true';
  const { experience, error } = await getExperience(slug, locale, isPreview);

  if (error) {
    return <div>{error.message}</div>;
  }

  const stylesheet = detachExperienceStyles(experience!);

  //experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;

  return (
    <main style={{ width: '100%' }}>
      <Experience experienceJSON={experienceJSON} locale={locale} stylesheet={stylesheet} />
    </main>
  );
}
