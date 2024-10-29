import React from 'react';
import './ContentfulDivider.css';

export type ContentfulDividerProps = {
  className?: string;
  dragProps?: unknown;
};

export const ContentfulDivider = ({
  className = '',
  // We have to exclude this explicitly from rendering as withComponentWrapper is not used
  dragProps: _,
  ...props
}: ContentfulDividerProps) => {
  return (
    <div className="cf-divider" {...props}>
      <hr className={className} />
    </div>
  );
};
