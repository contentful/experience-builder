import React, { forwardRef } from 'react';
import './Columns.css';
import { combineClasses } from '../../utils/combineClasses';
import { ColumnsProps } from './ColumnTypes';

const ColumnWrapper = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      style={{
        ...props.style,
        display: 'grid',
        gridTemplateColumns: 'repeat(12, [col-start] 1fr)',
        gap: 10,
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
      <ColumnWrapper className={combineClasses(className, 'Columns')}>{children}</ColumnWrapper>
    );
  }

  const { node, renderDropzone } = props;

  return renderDropzone(node, {
    ['data-test-id']: 'contentful-container',
    ['data-cf-node-id']: node.data.id,
    ['data-cf-node-block-id']: node.data.blockId,
    ['data-cf-node-block-type']: node.type,
    id: 'ContentfulContainer',
    className: combineClasses(className, 'defaultStyles'),
    WrapperComponent: ColumnWrapper,
  });
};
