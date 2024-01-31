/* eslint-disable */
import React from 'react';
import './ContentfulContainer.css';
import { Flex } from '../Layout/Flex';
import { ContentfulContainerAsHyperlink } from './ContentfulContainerAsHyperlink';
import type { ContentfulContainerAsHyperlinkProps } from './ContentfulContainerAsHyperlink';
import { combineClasses } from '../../utils/combineClasses';

export const ContentfulContainer: React.FC<ContentfulContainerAsHyperlinkProps> = (
  sectionProps
) => {
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
        className={combineClasses(className, 'defaultStyles')}>
        {(sectionProps as any).children}
      </Flex>
    );
  }

  const { renderDropzone, node } = sectionProps;
  // Extract properties that are only available in editor mode

  return renderDropzone(node, {
    ['data-test-id']: 'contentful-container',
    id: 'ContentfulContainer',
    className: combineClasses(className, 'defaultStyles'),
    WrapperComponent: Flex,
  });
};
