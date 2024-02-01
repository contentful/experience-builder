import { combineClasses } from '@/utils/combineClasses';
import React from 'react';
import { SingleColumnProps } from './ColumnTypes';
import { Flex } from '@components/Layout/Flex';

export const SingleColumn: React.FC<SingleColumnProps> = (props) => {
  const { className, editorMode, children } = props;

  if (editorMode === false) {
    return <Flex className={className}>{children}</Flex>;
  }

  const {
    renderDropzone,
    node,
    innerRef,
    Tooltip,
    style,
    dragHandleProps,
    draggableProps,
    cfColumnSpan,
    editorMode: edit,
    wrapperClassName,
    ...editorProps
  } = props;

  const isEmpty = !node.children.length;
  return (
    <div
      ref={innerRef}
      {...dragHandleProps}
      {...draggableProps}
      {...editorProps}
      className={combineClasses(
        wrapperClassName,
        'cf-single-column-wrapper',
        isEmpty ? 'cf-single-column-empty' : ''
      )}
      style={{
        ...style,
        gridColumn: `span ${cfColumnSpan}`,
      }}>
      {Tooltip}
      {isEmpty && <div className="cf-single-column-label">Column</div>}
      {renderDropzone(node, {
        ['data-test-id']: 'contentful-single-column',
        className,
        WrapperComponent: Flex,
      })}
    </div>
  );
};
