import {
  ExperienceRoot,
  createExperience,
  detachExperienceStyles,
} from '@contentful/experiences-sdk-react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getExperience } from '@/getExperience';
import Head from 'next/head';
import { useMemo } from 'react';

interface Params extends ParsedUrlQuery {
  locale: string;
  slug: string;
  preview?: string;
}

interface Query extends ParsedUrlQuery {
  preview?: string;
  editor?: string;
}

function ExperiencePage({
  experienceJSON,
  stylesheet,
  locale,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // manually parse the experience JSON into a Experience object
  const experience = useMemo(() => {
    return experienceJSON ? createExperience(experienceJSON) : undefined;
  }, [experienceJSON]);

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
        <ExperienceRoot experience={experience} locale={locale} />
      </main>
    </>
  );
}

export const getServerSideProps = async (content: GetServerSidePropsContext<Params, Query>) => {
  const { params, query } = content;
  const { locale = 'en-US', slug = 'home-page' } = params || {};
  const { preview = 'false', editor = 'false' } = query;
  const isPreview = preview === 'true';
  const isEditorMode = editor === 'true';

  const { experience, error } = await getExperience(slug, locale, isPreview, isEditorMode);

  // extract the styles from the experience
  const stylesheet = experience ? detachExperienceStyles(experience) : null;
  //experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;

  return {
    props: {
      experienceJSON,
      stylesheet,
      locale,
      error: error?.message || null,
    },
  };
};

export default ExperiencePage;
