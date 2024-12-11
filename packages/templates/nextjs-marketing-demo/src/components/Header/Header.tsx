import React from 'react';
import Nav from './HeaderNav';
import styles from './styles.module.css';
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
