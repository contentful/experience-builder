'use client';
import React, { CSSProperties, forwardRef } from 'react';
import './Columns.css';
import { combineClasses } from '../../utils/combineClasses';
import { ColumnsProps } from './ColumnTypes';

interface ColumnWrapperProps {
  style?: CSSProperties;
  children: React.ReactNode;
  className?: string;
}

const ColumnWrapper = forwardRef<HTMLDivElement, ColumnWrapperProps>((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      style={{
        ...(props.style || {}),
        display: 'grid',
        gridTemplateColumns: 'repeat(12, [col-start] 1fr)',
      }}>
      {props.children}
    </div>
  );
});

ColumnWrapper.displayName = 'ColumnWrapper';

export const Columns: React.FC<ColumnsProps> = (props) => {
  const { editorMode, className, children } = props;

  if (!editorMode) {
    return (
      <ColumnWrapper className={combineClasses(className, 'cf-columns')}>{children}</ColumnWrapper>
    );
  }

  const { node, renderDropzone, dragProps = {}, ...rest } = props;

  return renderDropzone(node, {
    ...rest,
    ['data-test-id']: 'contentful-columns',
    id: 'ContentfulContainer',
    className: combineClasses('cf-columns', className),
    WrapperComponent: ColumnWrapper,
    dragProps,
  });
};
