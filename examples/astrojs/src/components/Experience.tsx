import React from 'react';
import { ExperienceRoot } from '@contentful/experiences-sdk-react';
import type { ExperienceType } from '../getExperience';

// import '@/studio-config';

interface ExperienceProps {
  experience: ExperienceType;
  locale: string;
}

const Experience: React.FC<ExperienceProps> = ({ experience, locale }) => {
  return <ExperienceRoot experience={experience} locale={locale} />;
};

export default Experience;
