'use client';

import '../studio-config';
import { ExperienceRoot } from '@contentful/experiences-sdk-react';
import React from 'react';

interface ExperienceProps {
  experienceJSON: string | null;
  locale: string;
  initialStore: unknown;
}

const Experience: React.FC<ExperienceProps> = ({ experienceJSON, locale, initialStore }) => {
  return <ExperienceRoot initialStore={initialStore} experience={experienceJSON} locale={locale} />;
};

export default Experience;
