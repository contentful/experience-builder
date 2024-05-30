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
  experienceJSON: string;
  locale: string;
}) {
  const experience = createExperience(experienceJSON);
  // const stylesheet = detachExperienceStyles(experience);
  const stylesheet = useMemo(() => {
    console.log('in memo');
    return detachExperienceStyles(experience);
  }, [experience]);
  return (
    <>
      {stylesheet && <style data-ssg>{stylesheet}</style>}
      <ExperienceRoot experience={experience} locale={locale} />
    </>
  );
}
