import { ExperienceBuilderHeading } from '@contentful/experience-builder-components';
// import { ExperienceBuilderButton } from '@contentful/experience-builder-components';
import React from 'react';

interface StaticPageProps {}

export const StaticPage: React.FC<StaticPageProps> = () => {
  return (
    <div>
      {/* <ExperienceBuilderButton url="/" label="test" /> */}
      <ExperienceBuilderHeading dataCfNodeBlockId="adsf" text="Static Page" />
    </div>
  );
};
