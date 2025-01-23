import React from 'react';
import { PageProps } from 'gatsby';
import { ExperienceRoot } from '@contentful/experiences-sdk-react';
import '../studio-config.mjs';

type PageContextProps = {
  experienceJson: string;
  stylesheet: string;
  localeCode: string;
};

export default function StudioExperiencePage(pageProps: PageProps) {
  const { experienceJson, stylesheet, localeCode } =
    pageProps.pageContext as PageContextProps;

  return (
    <>
      <style>{stylesheet}</style>
      <ExperienceRoot experience={experienceJson} locale={localeCode} />
    </>
  );
}
