import { ExperienceRoot, detachExperienceStyles } from '@contentful/experiences-sdk-react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getExperience } from '@/getExperience';
import Head from 'next/head';
import '../studio-config';

interface Params extends ParsedUrlQuery {
  locale: string;
  slug: string;
}

interface Query extends ParsedUrlQuery {
  isPreview?: string;
  expEditorMode?: string;
}

function ExperiencePage({
  experienceJSON,
  error,
  stylesheet,
  locale,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {stylesheet && (
        <Head>
          <style data-ssg>{stylesheet}</style>
        </Head>
      )}
      <main style={{ width: '100%' }}>
        <ExperienceRoot experience={experienceJSON} locale={locale} />
      </main>
    </>
  );
}

export const getServerSideProps = async ({
  params,
  query,
  locale = 'en-US',
}: GetServerSidePropsContext<Params, Query>) => {
  const { slug = 'home-page' } = params || {};
  const { isPreview, expEditorMode } = query;
  const preview = isPreview === 'true';
  const editorMode = expEditorMode === 'true';

  const { experience, error } = await getExperience(slug, locale, preview, editorMode);

  // extract the styles from the experience
  const stylesheet = experience ? detachExperienceStyles(experience) : null;
  // experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;

  return {
    props: {
      experienceJSON,
      error: error?.message || null,
      stylesheet,
      locale,
    },
  };
};

export default ExperiencePage;
