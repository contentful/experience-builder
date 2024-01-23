/* eslint-disable */ /* TODO: fix eslint errors */
import React, { RefObject } from 'react';

import type {
  CompositionComponentNode,
  CompositionDataSource,
  CompositionUnboundValues,
  StyleProps,
} from '@contentful/experience-builder-core/types';

import { EntityStore } from '@contentful/experience-builder-core';
import { combineClasses } from '../../utils/combineClasses';

export type ContentfulContainerAsHyperlinkProps<EditorMode = boolean> = (EditorMode extends true
  ? {
      editorMode?: EditorMode;
      node: CompositionComponentNode;
      dataSource?: CompositionDataSource;
      unboundValues?: CompositionUnboundValues;
      resolveDesignValue?: any;
      entityStore?: RefObject<EntityStore>;
      areEntitiesFetched?: boolean;
      renderDropzone: (
        node: CompositionComponentNode,
        props?: Record<string, any>
      ) => React.ReactNode;
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
  props
) => {
  const { cfHyperlink, cfOpenInNewTab, editorMode, className, children } = props;

  let anchorTagProps = {};
  if (cfOpenInNewTab) {
    anchorTagProps = {
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }

  if (editorMode === false) {
    return (
      <a
        className={combineClasses(className, 'ContentfulContainer', 'cf-section-link')}
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
    ['data-cf-node-id']: node.data.id,
    ['data-cf-node-block-id']: node.data.blockId,
    ['data-cf-node-block-type']: node.type,
    className: combineClasses(className, 'ContentfulContainer', 'cf-section-link'),
    zoneId: node.data.id,
    WrapperComponent: 'a',
    onClick: stopPropagationInEditorMode,
  });

  // return (
  //   <a
  //     id="ContentfulContainer"
  //     className={combineClasses(className, 'ContentfulContainer', 'cf-section-link')}
  //     href={cfHyperlink}
  //     {...anchorTagProps}
  //     onClick={stopPropagationInEditorMode}
  //     data-cf-node-id={node.data.id}
  //     data-cf-node-block-id={node.data.blockId}
  //     data-cf-node-block-type={node.type}>
  //     {renderDropzone(node)}
  //   </a>
  // );
};
