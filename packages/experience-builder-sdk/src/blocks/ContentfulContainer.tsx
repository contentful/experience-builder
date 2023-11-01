import React from 'react';

import '../styles/ContentfulContainer.css';

import classNames from 'classnames';

import { Flex } from '../core';
import { ContentfulContainerAsHyperlink } from './ContentfulContainerAsHyperlink';
import type { ContentfulContainerProps } from './ContentfulContainerAsHyperlink';

export const ContentfulContainer = (sectionProps: ContentfulContainerProps) => {
  const { children, className, editorMode } = sectionProps;

  if (sectionProps.cfHyperlink) {
    return (
      <ContentfulContainerAsHyperlink
        className={className}
        editorMode={editorMode}
        cfHyperlink={sectionProps.cfHyperlink}
        cfOpenInNewTab={sectionProps.cfOpenInNewTab}
        onMouseDown={(sectionProps as ContentfulContainerProps<true>).onMouseDown}
        node={(sectionProps as ContentfulContainerProps<true>).node}>
        {children}
      </ContentfulContainerAsHyperlink>
    );
  }

  if (editorMode === false) {
    return (
      <Flex id="ContentfulContainer" className={classNames(className, 'defaultStyles')}>
        {children}
      </Flex>
    );
  }

  // Extract properties that are only available in editor mode
  const { node, onMouseDown } = sectionProps;

  return (
    <Flex
      id="ContentfulContainer"
      data-cf-node-id={node.data.id}
      data-cf-node-block-id={node.data.blockId}
      data-cf-node-block-type={node.type}
      className={classNames(className, 'defaultStyles')}
      onMouseDown={onMouseDown}
      // For blocks of design components, they should not be clickable
      // Clicking on anywhere in the design component should not trigger the selection a child block
      // Hence we place design component blocks behind the design component wrapper, so that on mouse down
      // it select only the wrapper component
      cssStyles={{ zIndex: node.type === 'DesignComponentBlock' ? '-1' : '1' }}>
      {children}
    </Flex>
  );
};
