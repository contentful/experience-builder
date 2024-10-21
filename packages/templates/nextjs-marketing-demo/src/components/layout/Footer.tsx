import React from 'react';
import { Menu } from 'antd';
import styles from './footer.module.css';

const items = [
  { key: 'book-now', label: 'Book Now' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'careers', label: 'Careers' },
];

const Footer: React.FC = () => {
  return <Menu mode="horizontal" className={styles.menu} items={items} />;
};

export default Footer;
