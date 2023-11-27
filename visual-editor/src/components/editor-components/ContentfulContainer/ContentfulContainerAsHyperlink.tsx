import React, { RefObject } from 'react';

import './ContentfulContainer.css';
import classNames from 'classnames';

import {
  CompositionComponentNode,
  CompositionDataSource,
  CompositionUnboundValues,
  StyleProps,
} from '@contentful/experience-builder-core';
import { ResolveDesignValueType } from '@/hooks/useBreakpoints';
import { EntityStore } from '@contentful/visual-sdk';

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
      resolveDesignValue?: ResolveDesignValueType;
      entityStore?: RefObject<EntityStore>;
      areEntitiesFetched?: boolean;
    }
  : {
      className?: string;
      cfHyperlink?: StyleProps['cfHyperlink'];
      cfOpenInNewTab?: StyleProps['cfOpenInNewTab'];
      children?: React.ReactNode;
      editorMode: EditorMode;
    };

export const ContentfulContainerAsHyperlink = (props: ContentfulContainerProps) => {
  const { cfHyperlink, cfOpenInNewTab, children, editorMode, className } = props;

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
        className={classNames(className, 'defaultStyles', 'cf-section-link')}
        href={cfHyperlink}
        {...anchorTagProps}>
        {children}
      </a>
    );
  }

  // Extract properties that are only available in editor mode
  const { node } = props;

  const stopPropagationInEditorMode = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <a
      id="ContentfulContainer"
      className={classNames(className, 'defaultStyles', 'cf-section-link')}
      href={cfHyperlink}
      {...anchorTagProps}
      onClick={stopPropagationInEditorMode}
      data-cf-node-id={node.data.id}
      data-cf-node-block-id={node.data.blockId}
      data-cf-node-block-type={node.type}>
      {children}
    </a>
  );
};
