import { ExperienceRoot, useFetchBySlug } from '@contentful/experiences-sdk-react';
import { FC } from 'react';
import { useContentfulConfig } from './hooks/useContentfulConfig';
import { useContentfulClient } from './hooks/useContentfulClient';

/**
 *
 * @description - page to to render Contentful Studio Canvas in EDITOR MODE
 * // Link to editor vs. preview vs. live mode tbd
 */
export const EditorMode: FC = () => {
  // todo: need to retrieve actual experience id to edit from URL
  const experienceIdSlug = 'hackathon-dyno';
  // hard-coded since we're in a component called <EditorMode>
  // const isExperienceEditorMode = true;
  // todo: need to retrieve from URL
  const localeCode = 'en-US';

  const { config } = useContentfulConfig();
  const { client } = useContentfulClient();

  const { experience, error, isLoading } = useFetchBySlug({
    slug: experienceIdSlug,
    localeCode,
    client,
    experienceTypeId: config.experienceTypeId,
    hyperlinkPattern: '/{entry.fields.slug}',
  });
  ``;
  console.log('[ <dyno-hackathon> ] App experience => ', experience);

  if (error) {
    console.error(error);
    return <p>Error!</p>;
  }

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    // TODO: wrap in <ContentfulConfigProvider>
    <ExperienceRoot experience={experience} locale={localeCode} />
  );
};
