'use client';

import React, { useMemo } from 'react';
import { ExperienceRoot, createExperience } from '@contentful/experiences-sdk-react';

interface ExperienceProps extends React.PropsWithChildren {
  experienceJSON: string | null;
  stylesheet?: string;
  locale: string;
}

const Experience: React.FC<ExperienceProps> = ({ experienceJSON, stylesheet, locale }) => {
  const experience = useMemo(() => {
    return experienceJSON ? createExperience(experienceJSON) : undefined;
  }, [experienceJSON]);

  return (
    <>
      {stylesheet && <style data-css-ssr>{stylesheet}</style>}
      <ExperienceRoot experience={experience} locale={locale} />
    </>
  );
};

export default Experience;
