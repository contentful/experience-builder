import React from 'react';
import { Experience, ExperienceRoot } from '@contentful/experiences-sdk-react';

interface ExperienceProps {
  experience: Experience;
  locale: string;
}

const Experience: React.FC<ExperienceProps> = ({ experience, locale }) => {
  return <ExperienceRoot experience={experience} locale={locale} />;
};

export default Experience;
