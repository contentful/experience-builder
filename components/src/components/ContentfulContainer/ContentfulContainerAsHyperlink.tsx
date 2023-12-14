/* eslint-disable */ /* TODO: fix eslint errors */
import React, { RefObject } from 'react';

import {
  CompositionComponentNode,
  CompositionDataSource,
  CompositionUnboundValues,
  StyleProps,
} from '@contentful/experience-builder-core';

import { EntityStore } from '@contentful/visual-sdk';
import { combineClasses } from '../../utils/combineClasses';

export type ContentfulContainerProps<EditorMode = boolean> = EditorMode extends true
  ? {
      children?: React.ReactNode;
      className?: string;
      cfHyperlink?: StyleProps['cfHyperlink'];
      cfOpenInNewTab?: StyleProps['cfOpenInNewTab'];
      editorMode?: EditorMode;
      node: CompositionComponentNode;
      dataSource?: CompositionDataSource;
      unboundValues?: CompositionUnboundValues;
      resolveDesignValue?: any;
      entityStore?: RefObject<EntityStore>;
      areEntitiesFetched?: boolean;
      renderDropZone: (
        node: CompositionComponentNode,
        props?: Record<string, any>
      ) => React.ReactNode;
    }
  : {
      className?: string;
      cfHyperlink?: StyleProps['cfHyperlink'];
      cfOpenInNewTab?: StyleProps['cfOpenInNewTab'];
      editorMode: EditorMode;
      children?: React.ReactNode;
    };

export const ContentfulContainerAsHyperlink = (props: ContentfulContainerProps) => {
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
        id="ContentfulContainer"
        className={combineClasses(className, 'defaultStyles', 'cf-section-link')}
        href={cfHyperlink}
        {...anchorTagProps}>
        {children}
      </a>
    );
  }

  const { renderDropZone, node } = props;

  const stopPropagationInEditorMode = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return renderDropZone(node, {
    ['data-test-id']: 'contentful-container',
    ['data-cf-node-id']: node.data.id,
    ['data-cf-node-block-id']: node.data.blockId,
    ['data-cf-node-block-type']: node.type,
    id: 'ContentfulContainer',
    className: combineClasses(className, 'defaultStyles', 'cf-section-link'),
    zoneId: node.data.id,
    WrapperComponent: 'a',
    onClick: stopPropagationInEditorMode,
  });

  // return (
  //   <a
  //     id="ContentfulContainer"
  //     className={combineClasses(className, 'defaultStyles', 'cf-section-link')}
  //     href={cfHyperlink}
  //     {...anchorTagProps}
  //     onClick={stopPropagationInEditorMode}
  //     data-cf-node-id={node.data.id}
  //     data-cf-node-block-id={node.data.blockId}
  //     data-cf-node-block-type={node.type}>
  //     {renderDropZone(node)}
  //   </a>

  // );
};
