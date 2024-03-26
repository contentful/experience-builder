/* eslint-disable */
import React from 'react';
import './ContentfulDivider.css';
import { combineClasses } from '@/utils/combineClasses';

export const ContentfulDivider: React.FC<Record<any, any>> = (props) => {
  const { className, ...rest } = props;
  return <div className={combineClasses(className, 'cf-divider')} {...rest} />;
};
