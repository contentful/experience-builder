import { combineClasses } from '@/utils/combineClasses';
import React from 'react';
import { Flex } from '@components/Layout/Flex';
import { StructureComponentProps } from '@contentful/experiences-core/types';
import { extractRenderProps } from '@/utils/extractRenderProps';

type SingleColumnProps = StructureComponentProps<{
  className?: string;
}>;

export const SingleColumn: React.FC<SingleColumnProps> = (props) => {
  const { className, editorMode } = props;

  if (!editorMode) {
    return <Flex className={className}>{props.children}</Flex>;
  }

  const { node, children } = props;
  const isEmpty = !node.children.length;
  const mixedClassName = combineClasses(
    'cf-single-column-wrapper',
    className,
    isEmpty ? 'cf-single-column-label' : '',
  );
  return (
    <Flex className={mixedClassName} {...extractRenderProps(props)}>
      {children}
    </Flex>
  );
};
