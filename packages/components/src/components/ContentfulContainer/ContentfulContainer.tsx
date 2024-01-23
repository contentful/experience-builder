/* eslint-disable */
import React from 'react';
import './ContentfulContainer.css';
import { Flex } from '../Layout/Flex';
import { ContentfulContainerAsHyperlink } from './ContentfulContainerAsHyperlink';
import type { ContentfulContainerAsHyperlinkProps } from './ContentfulContainerAsHyperlink';
import { combineClasses } from '../../utils/combineClasses';

export const ContentfulContainer: React.FC<ContentfulContainerAsHyperlinkProps> = (props) => {
  const { className, editorMode, children, cfHyperlink } = props;

  if (cfHyperlink) {
    return <ContentfulContainerAsHyperlink {...props}>{children}</ContentfulContainerAsHyperlink>;
  }

  if (editorMode === false) {
    return (
      <Flex
        data-test-id="contentful-container"
        className={combineClasses(className, 'contentful-container')}>
        {children}
      </Flex>
    );
  }

  // Extract properties that are only available in editor mode
  const { renderDropzone, node } = props;

  return renderDropzone(node, {
    ['data-test-id']: 'contentful-container',
    ['data-cf-node-id']: node.data.id,
    ['data-cf-node-block-id']: node.data.blockId,
    ['data-cf-node-block-type']: node.type,
    className: combineClasses(className, 'contentful-container'),
    WrapperComponent: Flex,
  });
};
