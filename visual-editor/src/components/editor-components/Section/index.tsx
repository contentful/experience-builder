import React from 'react';
import { CSSProperties, ReactNode } from 'react';
import './styles.css';

export type SectionProps = {
  className?: string;
  children: ReactNode;
  padding?: string;
  maxWidth?: string;
  style?: CSSProperties;
};

export const Section = ({
  children,
  className,
  padding = '0px',
  maxWidth = '1280px',
  style = {},
}: SectionProps) => {
  return (
    <div
      className={`${`Section`}${className ? ` ${className}` : ''}`}
      style={{
        ...style,
        paddingTop: padding,
        paddingBottom: padding,
      }}>
      <div className={'Section-inner'} style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
};
