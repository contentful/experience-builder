'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'antd';
import styles from './styles.module.css';

const items = [
  {
    key: '/home-page',
    label: <Link href="/">Home</Link>,
  },
  {
    key: '/about',
    label: 'About',
  },
  {
    key: '/contact',
    label: 'Contact',
  },
];

const FooterNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className={styles.nav}>
      <Menu selectedKeys={[pathname]} mode="horizontal" className={styles.menu} items={items} />
    </div>
  );
};

export default FooterNav;
