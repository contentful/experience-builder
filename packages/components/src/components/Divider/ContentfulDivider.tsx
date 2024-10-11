import React from 'react';
import './ContentfulDivider.css';

export type ContentfulDividerProps = {
  className?: string;
};

export const ContentfulDivider = ({ className = '', ...props }: ContentfulDividerProps) => {
  return (
    <div className="cf-divider" {...props}>
      <hr className={className} />
    </div>
  );
};
