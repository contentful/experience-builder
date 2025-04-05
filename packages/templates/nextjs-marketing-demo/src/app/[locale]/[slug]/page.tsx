import Experience from '@/components/Experience';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { getExperience } from '@/getExperience';
import { detachExperienceStyles } from '@contentful/experiences-sdk-react';
import { Layout } from 'antd';
import {
  Footer as LayoutFooter,
  Header as LayoutHeader,
  Content as LayoutContent,
} from 'antd/es/layout/layout';
import styles from '@/app/page.module.css';
import { MovieProvider } from '@/context/MovieContext';
import { prefetchMovies } from '@/context/movieApi';

type Page = {
  params: { locale?: string; slug?: string; preview?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ExperiencePage({ params, searchParams }: Page) {
  const { locale = 'en-US', slug = 'home-page' } = params || {};
  const { isPreview, expEditorMode } = searchParams;
  const preview = isPreview === 'true';
  const editorMode = expEditorMode === 'true';
  const { experience, error } = await getExperience(slug, locale, preview, editorMode);

  if (error) {
    return <>{error.message}</>;
  }

  // extract the styles from the experience
  const stylesheet = experience ? detachExperienceStyles(experience) : null;

  // TODO-STUDIO: We might want to offer a 3rd party prefetch helper that allows us
  //  to mark some component registration variables as relevant for 3rd party data.
  //  This should invoke some custom callback(s) where the customer can do their
  //  3rd party data prefetching for SSR.
  const usedMovieIds = [
    'tt1621444',
    'tt0047396',
    //, 'tt0265459' // Demonstrate how this will still be loaded client-side.
  ]; // TODO: Extract these IDs dynamically from experience.componentTree
  const prefetchedMovies = await prefetchMovies(usedMovieIds);

  // experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;
  return (
    <MovieProvider initialMovies={prefetchedMovies}>
      <Layout className={styles.layout}>
        {stylesheet && <style>{stylesheet}</style>}
        <LayoutHeader className={styles.header}>
          <Header />
        </LayoutHeader>
        <LayoutContent className={styles.content}>
          <Experience experienceJSON={experienceJSON} locale={locale} />
        </LayoutContent>
        <LayoutFooter className={styles.footer}>
          <Footer />
        </LayoutFooter>
      </Layout>
    </MovieProvider>
  );
}
