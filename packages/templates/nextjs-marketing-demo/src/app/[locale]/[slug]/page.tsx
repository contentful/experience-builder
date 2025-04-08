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

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getMovieQueryOptions } from '@/lib/queries/queryOptions';
import { getQueryClient } from '@/lib/queryClient';

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
  if (error) return <>{error.message}</>;

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

  const queryClient = getQueryClient();
  await Promise.all(usedMovieIds.map((id) => queryClient.prefetchQuery(getMovieQueryOptions(id))));

  const experienceJSON = experience ? JSON.stringify(experience) : null;

  return (
    <Layout className={styles.layout}>
      {stylesheet && <style>{stylesheet}</style>}
      <LayoutHeader className={styles.header}>
        <Header />
      </LayoutHeader>
      <LayoutContent className={styles.content}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Experience experienceJSON={experienceJSON} locale={locale} />
        </HydrationBoundary>
      </LayoutContent>
      <LayoutFooter className={styles.footer}>
        <Footer />
      </LayoutFooter>
    </Layout>
  );
}
