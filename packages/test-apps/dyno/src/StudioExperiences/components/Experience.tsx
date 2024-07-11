'use client';

import '../../eb-config';
import { ExperienceRoot } from '@contentful/experiences-sdk-react';
import React from 'react';

interface ExperienceProps {
  experienceJSON?: string | null;
  localeCode: string;
}

export const Experience: React.FC<ExperienceProps> = ({ experienceJSON, localeCode }) => {
  return <ExperienceRoot experience={experienceJSON} locale={localeCode} />;
};
