import React from 'react';
import { CSSProperties, ReactNode } from 'react';
import './Section.css';

export type SectionProps = {
  className?: string;
  children: ReactNode;
  padding?: string;
  maxWidth?: string;
  style?: CSSProperties;
};

export const Section = ({
  children,
  padding = '0px',
  maxWidth = '1280px',
  style = {},
  ...rest
}: SectionProps) => {
  return (
    <div
      className="ctfl-section"
      style={{
        ...style,
      }}
      {...rest}>
      {children}
    </div>
  );
};
