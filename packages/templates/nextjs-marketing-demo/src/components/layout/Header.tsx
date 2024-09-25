'use client';

import React, { useState } from 'react';
import { Button, Menu } from 'antd';
import styles from './header.module.css';

const items = [
  { key: 'home-page', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'careers', label: 'Careers' },
];

const Header: React.FC = () => {
  const [current, setCurrent] = useState('home-page');

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <span>Logo</span>
      </div>
      <div className={styles.nav}>
        <Menu
          onClick={(e) => setCurrent(e.key)}
          selectedKeys={[current]}
          mode="horizontal"
          className={styles.menu}
          items={items}
        />
        <Button variant="outlined" size="small">
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default Header;
