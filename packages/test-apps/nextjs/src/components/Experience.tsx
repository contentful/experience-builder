'use client';

import '../studio-config';
import { ExperienceRoot } from '@contentful/experiences-sdk-react';
import React from 'react';

interface ExperienceProps {
  experienceJSON: string | null;
  locale: string;
  debug?: boolean;
}

const Experience: React.FC<ExperienceProps> = ({ experienceJSON, locale, debug }) => {
  return <ExperienceRoot experience={experienceJSON} locale={locale} debug={debug} />;
};

export default Experience;
