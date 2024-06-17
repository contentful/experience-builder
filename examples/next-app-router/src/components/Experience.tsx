'use client';
import { ExperienceRoot, createExperience } from '@contentful/experiences-sdk-react';
import { useMemo } from 'react';

export default function Experience({
  experienceJSON,
  stylesheet,
  locale,
}: {
  experienceJSON: string | null;
  stylesheet?: string;
  locale: string;
}) {
  // manually parse the experience JSON into a Experience object
  const experience = useMemo(() => {
    return experienceJSON ? createExperience(experienceJSON) : undefined;
  }, [experienceJSON]);

  return (
    <>
      {stylesheet && <style data-css-ssr>{stylesheet}</style>}
      <ExperienceRoot experience={experience} locale={locale} />
    </>
  );
}
