import { combineClasses } from '@/utils/combineClasses';
import React from 'react';
import { SingleColumnProps } from './ColumnTypes';
import { Flex } from '@components/Layout/Flex';

export const SingleColumn: React.FC<SingleColumnProps> = (props) => {
  const { className, editorMode, children } = props;

  if (editorMode === false) {
    return <Flex className={combineClasses(className, 'defaultStyles')}>{children}</Flex>;
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
      {...(dragHandleProps as any)}
      {...(draggableProps as any)}
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
        ['data-test-id']: 'contentful-single-container',
        ['data-cf-node-id']: node.data.id,
        ['data-cf-node-block-id']: node.data.blockId,
        ['data-cf-node-block-type']: node.type,
        id: 'ContentfulSingleColumn',
        className: combineClasses(className, 'defaultStyles'),
        WrapperComponent: Flex,
      })}
    </div>
  );
};
