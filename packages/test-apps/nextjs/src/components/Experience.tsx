'use client';

//import { getConfig } from '@/utils/getExperience';
import '../studio-config';
import { ExperienceRoot } from '@contentful/experiences-sdk-react';
import React from 'react';
// import { registeredComponents } from '../studio-config';

interface ExperienceProps {
  experienceJSON: string | null;
  locale: string;
}

const Experience: React.FC<ExperienceProps> = ({ experienceJSON, locale }) => {
  //const [experience, setExperience] = useState<any>(null);

  // useEffect(() => {
  //   fetchById({
  //     client: getConfig(true),
  //     experienceTypeId: process.env.NEXT_PUBLIC_CTFL_EXPERIENCE_TYPE!,
  //     id: '7esRPWt0IaOJzvhchPN8qJ',
  //     localeCode: 'en-US'
  //   }).then((experience) => {
  //     defineComponents(registeredComponents);
  //     setExperience(experience);
  //   });
  // }, []);

  // if (!experienceJSON) {
  //   return null;
  // }

  return <ExperienceRoot experience={experienceJSON} locale={locale} />;
};

export default Experience;
