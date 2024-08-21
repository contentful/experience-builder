import React from 'react';
import './ContentfulDivider.css';

export type ContentfulDividerProps = {
  className?: string;
};

export const ContentfulDivider = (props: ContentfulDividerProps) => {
  const { className } = props;
  return (
    <div className="cf-divider" {...props}>
      <hr className={className} />
    </div>
  );
};
