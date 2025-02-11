'use client';

import { getConfig } from '@/utils/getExperience';
import '../studio-config';
import { defineComponents, ExperienceRoot, fetchById } from '@contentful/experiences-sdk-react';
import React, { useEffect, useState } from 'react';
import { mockComponents } from '@/utils/mockComponents';

interface ExperienceProps {
  // experienceJSON: string | null;
  locale: string;
}

const Experience: React.FC<ExperienceProps> = ({ locale }) => {
  const [experience, setExperience] = useState<any>(null);

  useEffect(() => {
    fetchById({
      client: getConfig(true),
      experienceTypeId: process.env.NEXT_PUBLIC_CTFL_EXPERIENCE_TYPE!,
      id: 'cbUVVmIlHzSqvaxmCVqKz',
      localeCode: 'en',
    }).then((experience) => {
      console.log('~experience', experience);
      const backfilledComponents = mockComponents(experience);
      console.log('~components', backfilledComponents);
      defineComponents(backfilledComponents);

      setExperience(experience);
    });
  }, []);

  if (!experience) {
    return null;
  }

  return <ExperienceRoot experience={experience} locale={locale} />;
};

export default Experience;
