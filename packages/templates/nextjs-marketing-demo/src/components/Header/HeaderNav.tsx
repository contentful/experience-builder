'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button, Grid, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
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
];

const mobileItems = [
  ...items,
  {
    key: '/contact',
    label: 'Contact',
  },
];

const Nav: React.FC = () => {
  const pathname = usePathname();
  const screens = Grid.useBreakpoint();

  if (screens.xs) {
    return (
      <div className={styles.nav}>
        <Menu
          selectedKeys={[pathname]}
          mode="horizontal"
          className={styles.mobileMenu}
          items={mobileItems}
          overflowedIndicator={
            <Button>
              <MenuOutlined />
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.nav}>
      <Menu selectedKeys={[pathname]} mode="horizontal" className={styles.menu} items={items} />
      <Button variant="outlined">Contact Us</Button>
    </div>
  );
};

export default Nav;
