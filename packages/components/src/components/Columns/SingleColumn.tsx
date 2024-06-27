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
    className: _className,
    dragProps = {},
    cfColumnSpan,
    editorMode: edit,
    ...editorProps
  } = props;

  const isEmpty = !node.children.length;

  return renderDropzone(node, {
    ['data-test-id']: 'contentful-single-column',
    id: 'ContentfulSingleColumn',
    className: combineClasses(
      'cf-single-column-wrapper',
      className,
      isEmpty ? 'cf-single-column-label' : '',
    ),
    WrapperComponent: Flex,
    dragProps,
    ...editorProps,
  });
};
