'use client';

import React, { useState } from 'react';
import { Button, Grid, Menu } from 'antd';
import styles from './nav.module.css';

const { useBreakpoint } = Grid;

const items = [
  { key: 'home-page', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'careers', label: 'Careers' },
];

const Nav: React.FC = () => {
  const [current, setCurrent] = useState('home-page');
  const screens = useBreakpoint();

  if (screens.xs) {
    return null;
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
      <Button variant="outlined">Book now</Button>
    </div>
  );
};

export default Nav;
