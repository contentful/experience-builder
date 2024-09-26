import React from 'react';
import { Button } from 'antd';
import Nav from './Nav';
import styles from './header.module.css';
import Logo from '../../../public/Logo.svg';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <Logo />
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
