import React from 'react';
import './ContentfulDivider.css';
import { combineClasses } from '@/utils/combineClasses';

export type ContentfulDividerProps = {
  className?: string;
};

export const ContentfulDivider = (props: ContentfulDividerProps) => {
  const { className } = props;
  return (
    <div className={combineClasses('cf-divider', className)} {...props}>
      <hr className={className} />
    </div>
  );
};
