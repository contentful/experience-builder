/* eslint-disable */
import React from 'react';

import classNames from 'classnames';
import { Flex } from './Flex';
import { ContentfulContainerAsHyperlink } from './ContentfulContainerAsHyperlink';
import type { ContentfulContainerProps } from './ContentfulContainerAsHyperlink';

export const ContentfulContainer = (sectionProps: ContentfulContainerProps) => {
  const { className, editorMode, children } = sectionProps;

  if (sectionProps.cfHyperlink) {
    return (
      <ContentfulContainerAsHyperlink
        className={className}
        editorMode={editorMode}
        cfHyperlink={sectionProps.cfHyperlink}
        cfOpenInNewTab={sectionProps.cfOpenInNewTab}
        {...sectionProps}>
        {children}
      </ContentfulContainerAsHyperlink>
    );
  }

  if (editorMode === false) {
    return (
      <Flex
        id="ContentfulContainer"
        data-test-id="contentful-container"
        className={classNames(className, 'defaultStyles')}>
        {(sectionProps as any).children}
      </Flex>
    );
  }

  const { renderDropZone, node } = sectionProps;
  // Extract properties that are only available in editor mode

  return renderDropZone(node, {
    ['data-test-id']: 'contentful-container',
    ['data-cf-node-id']: node.data.id,
    ['data-cf-node-block-id']: node.data.blockId,
    ['data-cf-node-block-type']: node.type,
    id: 'ContentfulContainer',
    className: classNames(className, 'defaultStyles'),
    zoneId: node.data.id,
    WrapperComponent: Flex,
  });
};
