import React from 'react';
import Nav from './Nav';
import styles from './header.module.css';
import Logo from '@/assets/Logo.svg';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <Logo />
      <Nav />
    </div>
  );
};

export default Header;
