/* eslint-disable */
import React from 'react';
import './ContentfulContainer.css';
import { Flex } from '../Layout/Flex';
import { ContentfulContainerAsHyperlink } from './ContentfulContainerAsHyperlink';
import type { ContentfulContainerAsHyperlinkProps } from './ContentfulContainerAsHyperlink';
import { combineClasses } from '../../utils/combineClasses';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';

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
  const { renderDropzone, node, dragProps = {}, ...editorModeProps } = props;

  const isEmpty = !node.children.length;

  const isSection = node.data.blockId === CONTENTFUL_COMPONENTS.section.id;

  return renderDropzone(node, {
    ...editorModeProps,
    ['data-test-id']: 'contentful-container',
    id: 'ContentfulContainer',
    className: combineClasses(
      'contentful-container',
      className,
      isEmpty ? (isSection ? 'contentful-section-label' : 'contentful-container-label') : '',
    ),
    WrapperComponent: Flex,
    dragProps,
  });
};
