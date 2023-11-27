import React from 'react';

import './ContentfulContainer.css';

import classNames from 'classnames';

import { Flex } from './Flex';
import { ContentfulContainerAsHyperlink } from './ContentfulContainerAsHyperlink';
import type { ContentfulContainerProps } from './ContentfulContainerAsHyperlink';
import { ComponentConfig, DropZone } from '@/core';
import { CONTENTFUL_CONTAINER_ID } from '@contentful/experience-builder';
import { Section } from '../Section';

export const ContentfulContainer = (sectionProps: ContentfulContainerProps) => {
  const { children, className, editorMode } = sectionProps;

  if (sectionProps.cfHyperlink) {
    return (
      <ContentfulContainerAsHyperlink
        className={className}
        editorMode={editorMode}
        cfHyperlink={sectionProps.cfHyperlink}
        cfOpenInNewTab={sectionProps.cfOpenInNewTab}
        node={(sectionProps as ContentfulContainerProps<true>).node}>
        <DropZone
          style={{
            backgroundColor: 'transparent',
          }}
          zone={`item-1`}
        />
      </ContentfulContainerAsHyperlink>
    );
  }

  if (editorMode === false) {
    return (
      <Flex
        id="ContentfulContainer"
        data-test-id="contentful-container"
        className={classNames(className, 'defaultStyles')}>
        <DropZone
          style={{
            backgroundColor: 'transparent',
          }}
          zone={`item-1`}
        />
      </Flex>
    );
  }

  // TODO
  // Figure out zone relationships

  // Extract properties that are only available in editor mode
  const { node, ...dropZoneEditorProps } = sectionProps;

  return (
    <Section>
      <DropZone
        // id="ContentfulContainer"
        data-test-id="contentful-container"
        data-cf-node-id={node.data.id}
        data-cf-node-block-id={node.data.blockId}
        data-cf-node-block-type={node.type}
        className={classNames(className, 'defaultStyles')}
        zone={`item-1`}
        node={node}
        WrapperComponent={Flex}
        {...dropZoneEditorProps}
      />
    </Section>
  );
};

export const ContentfulContainerDefinition: ComponentConfig<ContentfulContainerProps> = {
  id: CONTENTFUL_CONTAINER_ID,
  render: (props) => <ContentfulContainer {...props} />,
};
