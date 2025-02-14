'use client';

import { getConfig } from '@/utils/getExperience';
//import { getConfig } from '@/utils/getExperience';
import '../studio-config';
import { ExperienceRoot, fetchById } from '@contentful/experiences-sdk-react';
import React, { useEffect, useState } from 'react';
// import { registeredComponents } from '../studio-config';

interface ExperienceProps {
  locale: string;
}

const ExperienceClient: React.FC<ExperienceProps> = ({ locale }) => {
  const [experience, setExperience] = useState<any>(null);

  useEffect(() => {
    fetchById({
      client: getConfig(true),
      experienceTypeId: process.env.NEXT_PUBLIC_CTFL_EXPERIENCE_TYPE!,
      id: '7esRPWt0IaOJzvhchPN8qJ',
      localeCode: 'en-US',
    }).then((experience) => {
      setExperience(experience);
    });
  }, []);

  if (!experience) {
    return null;
  }

  return <ExperienceRoot experience={experience} locale={locale} />;
};

export default ExperienceClient;
