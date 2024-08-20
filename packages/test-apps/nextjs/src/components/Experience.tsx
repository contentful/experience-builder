'use client';

import '../studio-config';
import { ExperienceRoot } from '@contentful/experiences-sdk-react';
import React from 'react';

interface ExperienceProps {
  experienceJSON: string | null;
  locale: string;
  metadata: Record<string, any>;
}

const Experience: React.FC<ExperienceProps> = ({ experienceJSON, locale, metadata }) => {
  return <ExperienceRoot metadata={metadata} experience={experienceJSON} locale={locale} />;
};

export default Experience;
