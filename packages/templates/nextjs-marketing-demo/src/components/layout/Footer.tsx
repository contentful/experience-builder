import React from 'react';
import { Menu, Typography, Row, Col } from 'antd';
import styles from './footer.module.css';
import Container from './Container';

const links = [
  { key: '/home-page', label: 'Home' },
  { key: '/about', label: 'About' },
  { key: '/contact', label: 'Contact' },
];

const socials = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'pinterist', label: 'Pinterest' },
  { key: 'tiktok', label: 'Tiktok' },
  { key: 'linkedin', label: 'LinkedIn' },
];

const Footer: React.FC = () => {
  return (
    <Container>
      <Row gutter={[16, 32]}>
        <Col flex={1}>
          <Typography className={styles.heading}>Links</Typography>
          <Menu mode="horizontal" className={styles.menu} items={links} />
        </Col>
        <Col flex="none">
          <Typography className={styles.heading}>Follow us</Typography>
          <Menu mode="horizontal" className={styles.menu} items={socials} selectable={false} />
        </Col>
        <Col flex="auto"></Col>
      </Row>
      <Row className={styles.bottomRow}>
        <Col flex={4} />
        <Col flex={1}>
          <Typography className={styles.copyright}>
            &copy; Altitude design {new Date().getFullYear()}
          </Typography>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
