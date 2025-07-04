import React from 'react';
import type { StructureComponentProps, StyleProps } from '@contentful/experiences-core/types';
import { combineClasses } from '../../utils/combineClasses';
import { extractRenderProps } from '@/utils/extractRenderProps';

export type ContentfulContainerAsHyperlinkProps = StructureComponentProps<{
  className?: string;
  cfHyperlink?: StyleProps['cfHyperlink'];
  cfOpenInNewTab?: StyleProps['cfOpenInNewTab'];
}>;

export const ContentfulContainerAsHyperlink: React.FC<ContentfulContainerAsHyperlinkProps> = (
  props,
) => {
  const { cfHyperlink, cfOpenInNewTab, editorMode, className, children, ...otherProps } = props;
  const eventHandlingProps = editorMode === true ? { onClick: stopEventPropagation } : {};
  const anchorTagProps = cfOpenInNewTab
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};

  return (
    <a
      className={combineClasses(className, 'contentful-container', 'contentful-container-link')}
      href={cfHyperlink}
      {...anchorTagProps}
      {...eventHandlingProps}
      {...extractRenderProps(otherProps)}>
      {children}
    </a>
  );
};

const stopEventPropagation = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
  event.stopPropagation();
  event.preventDefault();
};
