import React from 'react';
import styles from './styles.module.css';
import { DraggableComponent } from '../Draggable/DraggableComponent';
import { sendMessage } from '@contentful/experience-builder-core';
import { useSelectedInstanceCoordinates } from '@/hooks/useSelectedInstanceCoordinates';
import { useEditorStore } from '@/store/editor';
import { useComponent } from './useComponent';
import { useZoneStore } from '@/store/zone';
import type {
  CompositionComponentNode,
  ResolveDesignValueType,
} from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SINGLE_COLUMN_ID,
  ASSEMBLY_BLOCK_NODE_TYPE,
  OUTGOING_EVENTS,
} from '@contentful/experience-builder-core/constants';
import { DraggableChildComponent } from '@components/Draggable/DraggableChildComponent';
import { RenderDropzoneFunction } from './Dropzone.types';

type EditorBlockProps = {
  node: CompositionComponentNode;
  index: number;
  userIsDragging: boolean;
  draggingNewComponent: boolean | undefined;
  resolveDesignValue: ResolveDesignValueType;
  renderDropzone: RenderDropzoneFunction;
  zoneId: string;
  parentSectionId: string;
};

export const EditorBlock: React.FC<EditorBlockProps> = ({
  node: rawNode,
  resolveDesignValue,
  renderDropzone,
  draggingNewComponent,
  index,
  zoneId,
  parentSectionId,
  userIsDragging,
}) => {
  const setHoveringZone = useZoneStore((state) => state.setHoveringZone);
  const setHoveringSection = useZoneStore((state) => state.setHoveringSection);
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const { node, componentId, wrapperProps, label, elementToRender } = useComponent({
    node: rawNode,
    resolveDesignValue,
    renderDropzone,
  });

  const coordinates = useSelectedInstanceCoordinates({ node });

  const sectionsWithZone = useZoneStore((state) => state.sectionsWithZones);

  const isContainer = node.data.blockId === CONTENTFUL_CONTAINER_ID;
  const containsZone = sectionsWithZone[componentId];

  const isAssemblyBlock = node.type === ASSEMBLY_BLOCK_NODE_TYPE;

  const onClick = (e: React.SyntheticEvent<Element, Event>) => {
    e.stopPropagation();

    if (isAssemblyBlock && !containsZone) {
      // Readonly components in an assembly cannot be selected
      return;
    }
    const nodeId = isAssemblyBlock ? parentSectionId : componentId;

    // Only select the node if the user intentionally clicked on it, but not when dragging
    if (!userIsDragging) {
      setSelectedNodeId(nodeId);
      sendMessage(OUTGOING_EVENTS.ComponentSelected, {
        nodeId,
      });
    }
  };

  const onMouseOver = (e: React.SyntheticEvent<Element, Event>) => {
    e.stopPropagation();

    if (containsZone) {
      setHoveringSection(componentId);
    } else {
      setHoveringSection(parentSectionId);
    }
    setHoveringZone(zoneId);
  };

  const onMouseOut = () => {
    setHoveringZone('');
  };

  if (node.data.blockId === CONTENTFUL_SINGLE_COLUMN_ID) {
    return (
      <DraggableChildComponent
        elementToRender={elementToRender}
        label={label || 'No Label Specified'}
        id={`draggable-${componentId}`}
        index={index}
        isAssemblyBlock={isAssemblyBlock}
        isDragDisabled={isAssemblyBlock}
        isSelected={selectedNodeId === componentId}
        userIsDragging={userIsDragging}
        isContainer={isContainer}
        coordinates={coordinates!}
        wrapperProps={wrapperProps}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        style={{
          pointerEvents: userIsDragging && draggingNewComponent ? 'all' : undefined,
        }}
      />
    );
  }

  return (
    <DraggableComponent
      label={label || 'No Label Specified'}
      id={componentId}
      index={index}
      isAssemblyBlock={isAssemblyBlock}
      isDragDisabled={isAssemblyBlock}
      isSelected={selectedNodeId === componentId}
      userIsDragging={userIsDragging}
      isContainer={isContainer}
      coordinates={coordinates!}
      wrapperProps={wrapperProps}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{
        pointerEvents: userIsDragging && draggingNewComponent ? 'all' : undefined,
      }}>
      {elementToRender()}

      {/* Hitboxes allow users to add a section between 2 components */}
      {userIsDragging && (
        <div
          className={styles.hitbox}
          onMouseOver={(e) => {
            e.stopPropagation();
            setHoveringZone(zoneId);
            setHoveringSection(parentSectionId);
          }}
        />
      )}
    </DraggableComponent>
  );
};
