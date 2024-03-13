import React from 'react';
import { DraggableComponent } from '../Draggable/DraggableComponent';
import { isContentfulStructureComponent, sendMessage } from '@contentful/experiences-core';
import { useSelectedInstanceCoordinates } from '@/hooks/useSelectedInstanceCoordinates';
import { useEditorStore } from '@/store/editor';
import { useComponent } from './useComponent';
import type {
  ExperienceTreeNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import {
  CONTENTFUL_COMPONENTS,
  PATTERN_NODE_TYPE,
  OUTGOING_EVENTS,
  PATTERN_BLOCK_NODE_TYPE,
} from '@contentful/experiences-core/constants';
import { DraggableChildComponent } from '@components/Draggable/DraggableChildComponent';
import { RenderDropzoneFunction } from './Dropzone.types';
import { PlaceholderParams } from '@components/Draggable/Placeholder';
import { ROOT_ID } from '@/types/constants';
import Hitboxes from './Hitboxes';

type EditorBlockProps = {
  placeholder: PlaceholderParams;
  node: ExperienceTreeNode;
  index: number;
  userIsDragging: boolean;
  draggingNewComponent: boolean | undefined;
  resolveDesignValue: ResolveDesignValueType;
  renderDropzone: RenderDropzoneFunction;
  zoneId: string;
};

export const EditorBlock: React.FC<EditorBlockProps> = ({
  node: rawNode,
  resolveDesignValue,
  renderDropzone,
  draggingNewComponent,
  index,
  zoneId,
  userIsDragging,
  placeholder,
}) => {
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const { node, componentId, wrapperProps, definition, elementToRender } = useComponent({
    node: rawNode,
    resolveDesignValue,
    renderDropzone,
    userIsDragging,
  });

  const coordinates = useSelectedInstanceCoordinates({ node });

  const isContainer = node.data.blockId === CONTENTFUL_COMPONENTS.container.id;
  const isSingleColumn = node.data.blockId === CONTENTFUL_COMPONENTS.singleColumn.id;
  const isPatternBlock = node.type === PATTERN_BLOCK_NODE_TYPE;
  const isPattern = node.type === PATTERN_NODE_TYPE;
  const isStructureComponent = isContentfulStructureComponent(node.data.blockId);
  const isRootComponent = zoneId === ROOT_ID;

  const enableRootHitboxes = isRootComponent && !!draggingNewComponent;

  const onClick = (e: React.SyntheticEvent<Element, Event>) => {
    e.stopPropagation();

    if (!userIsDragging) {
      setSelectedNodeId(node.data.id);
      // if it is the pattern directly we just want to select it as a normal component
      if (isPattern) {
        sendMessage(OUTGOING_EVENTS.ComponentSelected, {
          nodeId: node.data.id,
        });
        return;
      }

      sendMessage(OUTGOING_EVENTS.ComponentSelected, {
        assembly: node.data.assembly,
        pattern: node.data.pattern,
        nodeId: node.data.id,
      });
    }
  };

  if (node.data.blockId === CONTENTFUL_COMPONENTS.singleColumn.id) {
    return (
      <>
        <DraggableChildComponent
          elementToRender={elementToRender}
          id={componentId}
          index={index}
          isPatternBlock={isPatternBlock}
          isDragDisabled={isSingleColumn}
          isSelected={selectedNodeId === componentId}
          userIsDragging={userIsDragging}
          isContainer={isContainer}
          blockId={node.data.blockId}
          coordinates={coordinates!}
          wrapperProps={wrapperProps}
          onClick={onClick}
          definition={definition}
        />
        {isStructureComponent && userIsDragging && (
          <Hitboxes
            parentZoneId={zoneId}
            zoneId={componentId}
            enableRootHitboxes={enableRootHitboxes}
          />
        )}
      </>
    );
  }

  return (
    <DraggableComponent
      placeholder={placeholder}
      definition={definition}
      id={componentId}
      index={index}
      isPatternBlock={isPatternBlock}
      isDragDisabled={isPatternBlock}
      isSelected={selectedNodeId === componentId}
      userIsDragging={userIsDragging}
      isContainer={isContainer}
      blockId={node.data.blockId}
      coordinates={coordinates!}
      wrapperProps={wrapperProps}
      onClick={onClick}>
      {elementToRender()}
      {isStructureComponent && userIsDragging && (
        <Hitboxes
          parentZoneId={zoneId}
          zoneId={componentId}
          enableRootHitboxes={enableRootHitboxes}
        />
      )}
    </DraggableComponent>
  );
};
