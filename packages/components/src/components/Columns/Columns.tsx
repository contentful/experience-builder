import React from 'react';
import type { StructureComponentProps } from '@/types';
import { combineClasses } from '@/utils/combineClasses';
import { extractRenderProps } from '@/utils/extractRenderProps';
import './Columns.css';

type ColumnsProps = StructureComponentProps<{
  className?: string;
}>;

export const Columns = ({ className, children, ...otherProps }: ColumnsProps) => {
  return (
    <div
      className={combineClasses(className, 'cf-columns')}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, [col-start] 1fr)',
      }}
      {...extractRenderProps(otherProps)}>
      {children}
    </div>
  );
};
