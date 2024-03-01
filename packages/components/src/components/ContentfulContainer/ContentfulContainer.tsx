/* eslint-disable */
import React from 'react';
import './ContentfulContainer.css';
import { Flex } from '../Layout/Flex';
import { ContentfulContainerAsHyperlink } from './ContentfulContainerAsHyperlink';
import type { ContentfulContainerAsHyperlinkProps } from './ContentfulContainerAsHyperlink';
import { combineClasses } from '../../utils/combineClasses';
import { CONTENTFUL_SECTION_ID } from '@contentful/experience-builder-core/constants';

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

  const isEmpty = !node.children.length;

  const renderDropzoneComponent = () => {
    return renderDropzone(node, {
      ['data-test-id']: 'contentful-container',
      id: 'ContentfulContainer',
      className: combineClasses('contentful-container', className),
      WrapperComponent: Flex,
    });
  };

  // Perform ternary so that we only render the wrapper div if the container is empty
  return isEmpty ? (
    <div className="cf-container-wrapper" data-ctfl-draggable-id={node.data.id}>
      <div className="cf-container-label">
        {node.data.blockId === CONTENTFUL_SECTION_ID ? 'Section' : 'Container'}
      </div>
      {renderDropzoneComponent()}
    </div>
  ) : (
    renderDropzoneComponent()
  );
};
