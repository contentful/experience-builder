import React from 'react';
import './Columns.css';
import { combineClasses } from '../../utils/combineClasses';
import { StructureComponentProps } from '@contentful/experiences-core/types';
import { extractRenderProps } from '@/utils/extractRenderProps';

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
