'use client';

import React, { useState } from 'react';
import { Menu } from 'antd';
import styles from './nav.module.css';

const items = [
  { key: 'home-page', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'careers', label: 'Careers' },
];

const Nav: React.FC = () => {
  const [current, setCurrent] = useState('home-page');

  return (
    <Menu
      onClick={(e) => setCurrent(e.key)}
      selectedKeys={[current]}
      mode="horizontal"
      className={styles.menu}
      items={items}
    />
  );
};

export default Nav;
