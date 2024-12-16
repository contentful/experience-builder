import React from 'react';
import { ExperienceRoot } from '@contentful/experiences-sdk-react';
import { type Experience as ExperienceType } from '@contentful/experiences-sdk-react';

interface ExperienceProps {
  experience: ExperienceType;
  locale: string;
}

const Experience: React.FC<ExperienceProps> = ({ experience, locale }) => {
  return <ExperienceRoot experience={experience} locale={locale} />;
};

export default Experience;
