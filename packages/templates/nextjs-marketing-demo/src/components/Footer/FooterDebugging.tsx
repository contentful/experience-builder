'use client';

import React from 'react';
import reactPackage from 'react/package.json';
import { useSearchParams } from 'next/navigation';
import { version as sdkVersion } from '@contentful/experiences-sdk-react';
import { Divider, Flex, Typography } from 'antd';
import styles from './styles.module.css';

const FooterDebugging: React.FC = () => {
  const searchParams = useSearchParams();
  const isDebugMode = searchParams.has('debug');

  if (!isDebugMode) {
    return null;
  }

  return (
    <Flex align="center" vertical={false} className={styles.debugInfo}>
      <Typography className={styles.darkText}>Experiences SDK v{sdkVersion}</Typography>
      <Divider type="vertical" className={styles.divider} />
      <Typography className={styles.darkText}>React v{reactPackage.version}</Typography>
    </Flex>
  );
};

export default FooterDebugging;
