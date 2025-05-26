/* eslint-disable */ /* TODO: fix eslint errors */
import React, { RefObject } from 'react';

import type {
  ExperienceTreeNode,
  ExperienceDataSource,
  ExperienceUnboundValues,
  StyleProps,
  DragWrapperProps,
} from '@contentful/experiences-core/types';

import { EntityStore } from '@contentful/experiences-core';
import { combineClasses } from '../../utils/combineClasses';

export type ContentfulContainerAsHyperlinkProps<EditorMode = boolean> = (EditorMode extends true
  ? {
      editorMode?: EditorMode;
      node: ExperienceTreeNode;
    }
  : {
      editorMode: EditorMode;
    }) & {
  children?: React.ReactNode;
  className?: string;
  cfHyperlink?: StyleProps['cfHyperlink'];
  cfOpenInNewTab?: StyleProps['cfOpenInNewTab'];
};

export const ContentfulContainerAsHyperlink: React.FC<ContentfulContainerAsHyperlinkProps> = (
  props,
) => {
  const { cfHyperlink, cfOpenInNewTab, editorMode, className, children } = props;
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
      {...eventHandlingProps}>
      {children}
    </a>
  );
};

const stopEventPropagation = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
  event.stopPropagation();
  event.preventDefault();
};
