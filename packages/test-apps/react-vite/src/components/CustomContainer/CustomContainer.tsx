import React from 'react';
import styles from './CustomContainer.module.css';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const CustomContainer: React.FC<Props> = ({ className, children }) => {
  const combinedClasses = [styles.fullWidth, className].join(' ');
  return <div className={combinedClasses}>{children}</div>;
};
