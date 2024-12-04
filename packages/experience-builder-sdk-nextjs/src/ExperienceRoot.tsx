import { detachExperienceStyles, EntityStore } from '@contentful/experiences-core';
import { Experience } from '@contentful/experiences-core/types';
import { ExperienceRoot as ExperienceRootMain } from '@contentful/experiences-sdk-react';
import React from 'react';

interface ExperienceRootProps {
  experience?: Experience<EntityStore>;
  searchParams: { [key: string]: string | string[] | undefined };
  locale: string;
}

export const ExperienceRoot: React.FC<ExperienceRootProps> = ({ experience, locale }) => {
  const stylesheet = experience ? detachExperienceStyles(experience) : null;
  const experienceJSON = JSON.stringify(experience);
  return (
    <>
      {stylesheet && <style data-css-ssr>{stylesheet}</style>}
      <ExperienceRootMain experience={experienceJSON} locale={locale} />
    </>
  );
};
