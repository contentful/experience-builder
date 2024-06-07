/* eslint-disable */ /* TODO: fix eslint errors */
import React, { RefObject } from 'react';

import type {
  ExperienceTreeNode,
  ExperienceDataSource,
  ExperienceUnboundValues,
  StyleProps,
} from '@contentful/experiences-core/types';

import { EntityStore } from '@contentful/experiences-core';
import { combineClasses } from '../../utils/combineClasses';

export type ContentfulContainerAsHyperlinkProps<EditorMode = boolean> = (EditorMode extends true
  ? {
      editorMode?: EditorMode;
      node: ExperienceTreeNode;
      dataSource?: ExperienceDataSource;
      unboundValues?: ExperienceUnboundValues;
      resolveDesignValue?: any;
      entityStore?: RefObject<EntityStore>;
      areEntitiesFetched?: boolean;
      renderDropzone: (node: ExperienceTreeNode, props?: Record<string, any>) => React.ReactNode;
    }
  : {
      editorMode: EditorMode;
    }) & {
  children?: React.ReactNode;
  className?: string;
  cfHyperlink?: StyleProps['cfHyperlink'];
  cfOpenInNewTab?: StyleProps['cfOpenInNewTab'];
  WrapperComponent?: React.ElementType;
};

export const ContentfulContainerAsHyperlink: React.FC<ContentfulContainerAsHyperlinkProps> = (
  props,
) => {
  const { cfHyperlink, cfOpenInNewTab, editorMode, className, children } = props;

  if (editorMode === false) {
    let anchorTagProps = {};
    if (cfOpenInNewTab) {
      anchorTagProps = {
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    }

    return (
      <a
        className={combineClasses(className, 'contentful-container', 'contentful-container-link')}
        href={cfHyperlink}
        {...anchorTagProps}>
        {children}
      </a>
    );
  }

  const { renderDropzone, node } = props;

  const stopPropagationInEditorMode = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return renderDropzone(node, {
    ['data-test-id']: 'contentful-container',
    className: combineClasses(className, 'contentful-container', 'contentful-container-link'),
    zoneId: node.data.id,
    WrapperComponent: 'a',
    onClick: stopPropagationInEditorMode,
  });
};
