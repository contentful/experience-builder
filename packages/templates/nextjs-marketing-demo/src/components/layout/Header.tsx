import React from 'react';
import { Button } from 'antd';
import styles from './header.module.css';
import Nav from './nav';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <span>Logo</span>
      </div>
      <div className={styles.nav}>
        <Nav />
        <Button variant="outlined" size="small">
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default Header;
