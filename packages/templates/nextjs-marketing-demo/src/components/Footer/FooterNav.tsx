'use client';

import React, { useState } from 'react';
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
    label: <Link href="/about">About</Link>,
  },
  {
    key: '/contact',
    label: <Link href="/contact">Contact</Link>,
  },
];

const FooterNav: React.FC = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(pathname);

  return (
    <div className={styles.nav}>
      <Menu
        onClick={(e) => setCurrent(e.key)}
        selectedKeys={[current]}
        mode="horizontal"
        className={styles.menu}
        items={items}
      />
    </div>
  );
};

export default FooterNav;
