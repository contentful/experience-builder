'use client';
import {
  ExperienceRoot,
  createExperience,
  detachExperienceStyles,
} from '@contentful/experiences-sdk-react';
import { useMemo } from 'react';

export default function Experience({
  experienceJSON,
  locale,
}: {
  experienceJSON: string | null;
  locale: string;
}) {
  // manually parse the experience JSON into a Experience object
  const experience = useMemo(() => {
    return experienceJSON ? createExperience(experienceJSON) : undefined;
  }, [experienceJSON]);

  const stylesheet = useMemo(() => {
    return experience ? detachExperienceStyles(experience) : null;
  }, [experience]);

  return (
    <>
      {stylesheet && <style data-css-ssr>{stylesheet}</style>}
      <ExperienceRoot experience={experience} locale={locale} />
    </>
  );
}
