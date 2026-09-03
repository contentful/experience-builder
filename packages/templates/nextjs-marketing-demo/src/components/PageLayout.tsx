'use client';

import { Layout } from 'antd';
import {
  Footer as LayoutFooter,
  Header as LayoutHeader,
  Content as LayoutContent,
} from 'antd/es/layout/layout';
import styles from '@/app/page.module.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Experience from './Experience';

type PageLayoutProps = {
  stylesheet: string | null | undefined;
  experienceJSON: string | null;
  locale: string;
};

export default function PageLayout({ stylesheet, experienceJSON, locale }: PageLayoutProps) {
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
