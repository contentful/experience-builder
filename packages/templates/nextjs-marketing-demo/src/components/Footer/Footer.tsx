import React from 'react';
import { Menu, Typography, Flex } from 'antd';
import Container from '../Container';
import FooterNav from './FooterNav';
import styles from './styles.module.css';
import FooterDebugging from './FooterDebugging';

const socials = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'pinterist', label: 'Pinterest' },
  { key: 'tiktok', label: 'Tiktok' },
  { key: 'linkedin', label: 'LinkedIn' },
];

const Footer: React.FC = () => {
  return (
    <Container>
      <Flex gap="large" vertical>
        <Flex gap="large" vertical={false} wrap>
          <Flex className={styles.links} vertical>
            <Typography className={styles.heading}>Links</Typography>
            <FooterNav />
          </Flex>
          <Flex className={styles.links} vertical>
            <Typography className={styles.heading}>Follow us</Typography>
            <Menu mode="horizontal" className={styles.menu} items={socials} selectable={false} />
          </Flex>
        </Flex>
        <Flex justify="flex-end" vertical={false}>
          <Flex align="flex-end" vertical>
            <Typography className={styles.copyright}>
              Altitude Design &copy;{new Date().getFullYear()}
            </Typography>
            <FooterDebugging />
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Footer;
