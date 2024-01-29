import React, { MouseEventHandler } from 'react';

import '../styles/ContentfulContainer.css';
import classNames from 'classnames';

import type {
  CompositionComponentNode,
  StyleProps,
} from '@contentful/experience-builder-core/types';

export type ContentfulContainerAsHyperlinkProps<EditorMode = boolean> = EditorMode extends true
  ? {
      onMouseDown: MouseEventHandler<HTMLElement>;
      children?: React.ReactNode;
      className?: string;
      cfHyperlink?: StyleProps['cfHyperlink'];
      cfOpenInNewTab?: StyleProps['cfOpenInNewTab'];
      editorMode?: EditorMode;
      node: CompositionComponentNode;
    }
  : {
      className?: string;
      cfHyperlink?: StyleProps['cfHyperlink'];
      cfOpenInNewTab?: StyleProps['cfOpenInNewTab'];
      children?: React.ReactNode;
      editorMode: EditorMode;
    };

export const ContentfulContainerAsHyperlink = (props: ContentfulContainerAsHyperlinkProps) => {
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
  const { node, onMouseDown } = props;

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
      data-cf-node-block-type={node.type}
      onMouseDown={onMouseDown}>
      {children}
    </a>
  );
};