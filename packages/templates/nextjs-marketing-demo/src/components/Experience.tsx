'use client';

import '../studio-config';
import { ExperienceRoot } from '@contentful/experiences-sdk-react';
import React from 'react';

interface ExperienceProps {
  experienceJSON: string | null;
  locale: string;
}

const Experience: React.FC<ExperienceProps> = ({ experienceJSON, locale }) => {
  return <ExperienceRoot experience={experienceJSON} locale={locale} />;
};

export default Experience;
