'use client';

import React, { useState } from 'react';
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
    label: <Link href="/about">About</Link>,
  },
];

const mobileItems = [
  ...items,
  {
    key: '/contact',
    label: <Link href="/contact">Contact</Link>,
  },
];

const Nav: React.FC = () => {
  const pathname = usePathname();
  const [current, setCurrent] = useState(pathname);
  const screens = Grid.useBreakpoint();

  if (screens.xs) {
    return (
      <div className={styles.nav}>
        <Menu
          onClick={(e) => setCurrent(e.key)}
          selectedKeys={[current]}
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
      <Menu
        onClick={(e) => setCurrent(e.key)}
        selectedKeys={[current]}
        mode="horizontal"
        className={styles.menu}
        items={items}
      />
      <Link href="/contact">
        <Button variant="outlined">Contact Us</Button>
      </Link>
    </div>
  );
};

export default Nav;
