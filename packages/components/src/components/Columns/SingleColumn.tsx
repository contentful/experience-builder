import React from 'react';
import { Flex } from '@components/Layout/Flex';
import type { StructureComponentProps } from '@/types';
import { extractRenderProps } from '@/utils/extractRenderProps';
import { combineClasses } from '@/utils/combineClasses';

type SingleColumnProps = StructureComponentProps<{
  className?: string;
}>;

export const SingleColumn: React.FC<SingleColumnProps> = (props) => {
  const { className, isEditorMode } = props;

  if (!isEditorMode) {
    return <Flex className={className}>{props.children}</Flex>;
  }

  const { isEmpty, children } = props;
  const mixedClassName = combineClasses(
    'cf-single-column-wrapper',
    className,
    isEmpty ? 'cf-single-column-label' : '',
  );
  return (
    <Flex {...extractRenderProps(props)} className={mixedClassName}>
      {children}
    </Flex>
  );
};
