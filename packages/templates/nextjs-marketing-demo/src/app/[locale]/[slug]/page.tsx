import Experience from '@/components/Experience';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getExperience } from '@/getExperience';
import { detachExperienceStyles } from '@contentful/experiences-sdk-react';
import { Layout } from 'antd';
import {
  Footer as LayoutFooter,
  Header as LayoutHeader,
  Content as LayoutContent,
} from 'antd/es/layout/layout';
import styles from '@/app/page.module.css';
import '../../../studio-config';

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
    return <div>{error.message}</div>;
  }

  // extract the styles from the experience
  const stylesheet = experience ? detachExperienceStyles(experience) : null;

  // experience currently needs to be stringified manually to be passed to the component
  const experienceJSON = experience ? JSON.stringify(experience) : null;
  return (
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
  );
}
