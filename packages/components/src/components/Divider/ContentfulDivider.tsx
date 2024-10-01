import React from 'react';
import './ContentfulDivider.css';
import { css, cx } from 'emotion';

const styles = {
  hr: css({
    border: 'none',
  }),
};

export type ContentfulDividerProps = {
  className?: string;
};

export const ContentfulDivider = (props: ContentfulDividerProps) => {
  const { className } = props;
  return (
    <div className="cf-divider" {...props}>
      <hr className={cx(styles.hr, className)} />
    </div>
  );
};
