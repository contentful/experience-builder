import { getExperience } from '@/utils';
import Experience from '@/components/Experience';

export default async function SsrPage({ params }: { params: { locale?: string; slug?: string } }) {
  const { locale = 'en-US', slug = 'home-page' } = params || {};
  const experience = await getExperience(slug, locale);

  if (!experience) {
    return <div>Experience {slug} not found</div>;
  }

  const experienceJSON = JSON.stringify(experience);

  return <Experience experienceJSON={experienceJSON} locale={locale} />;
}
