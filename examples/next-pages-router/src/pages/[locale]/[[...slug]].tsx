import { fetchBySlug, ExperienceRoot, createExperience } from '@contentful/experiences-sdk-react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getConfig } from '@/utils';
import { ParsedUrlQuery } from 'querystring';

interface Params extends ParsedUrlQuery {
  locale: string;
  slug: string;
}

function SsrPage({ experienceJSON }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const experience = createExperience(experienceJSON);
  return (
    <main style={{ width: '100%' }}>
      <ExperienceRoot experience={experience} locale={'en-US'} />
    </main>
  );
}

export const getServerSideProps = async ({ params, query }: GetServerSidePropsContext<Params>) => {
  const { locale = 'en-US', slug = 'home-page' } = params || {};
  const { client, experienceTypeId } = getConfig();
  const experience = await fetchBySlug({
    client,
    slug,
    experienceTypeId,
    localeCode: locale,
  });

  return {
    props: {
      //experience currently needs to be stringified manually to be passed to the component
      experienceJSON: JSON.stringify(experience),
    },
  };
};

export default SsrPage;
