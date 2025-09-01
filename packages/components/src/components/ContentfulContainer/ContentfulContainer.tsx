/* eslint-disable */
import React from 'react';
import './ContentfulContainer.css';
import { Flex } from '../Layout/Flex';
import { ContentfulContainerAsHyperlink } from './ContentfulContainerAsHyperlink';
import type { ContentfulContainerAsHyperlinkProps } from './ContentfulContainerAsHyperlink';
import { combineClasses } from '../../utils/combineClasses';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { extractRenderProps } from '@/utils/extractRenderProps';

export const ContentfulContainer: React.FC<ContentfulContainerAsHyperlinkProps> = (props) => {
  // Extract hyperlink-related props to not pass them to the regular container
  const { className, isEditorMode, children, cfHyperlink, cfOpenInNewTab, ...otherProps } = props;

  if (cfHyperlink) {
    return <ContentfulContainerAsHyperlink {...props}>{children}</ContentfulContainerAsHyperlink>;
  }

  if (!isEditorMode) {
    return (
      <Flex
        data-test-id="contentful-container"
        {...extractRenderProps(otherProps)}
        className={combineClasses(className, 'contentful-container')}>
        {children}
      </Flex>
    );
  }

  // Extract properties that are only available in editor mode
  const { isEmpty, nodeBlockId } = props;
  const isSection = nodeBlockId === CONTENTFUL_COMPONENTS.section.id;

  return (
    <Flex
      data-test-id="contentful-container"
      {...extractRenderProps(props)}
      className={combineClasses(
        className,
        'contentful-container',
        isEmpty ? (isSection ? 'contentful-section-label' : 'contentful-container-label') : '',
      )}>
      {children}
    </Flex>
  );
};
