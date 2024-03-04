import React from 'react';
import { DraggableComponent } from '../Draggable/DraggableComponent';
import { isContentfulStructureComponent, sendMessage } from '@contentful/experiences-core';
import { useSelectedInstanceCoordinates } from '@/hooks/useSelectedInstanceCoordinates';
import { useEditorStore } from '@/store/editor';
import { useComponent } from './useComponent';
import type {
  CompositionComponentNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import {
  CONTENTFUL_COMPONENTS,
  ASSEMBLY_BLOCK_NODE_TYPE,
  OUTGOING_EVENTS,
  ASSEMBLY_NODE_TYPE,
} from '@contentful/experiences-core/constants';
import { DraggableChildComponent } from '@components/Draggable/DraggableChildComponent';
import { RenderDropzoneFunction } from './Dropzone.types';
import { PlaceholderParams } from '@components/Draggable/Placeholder';
import { ROOT_ID } from '@/types/constants';
import Hitboxes from './Hitboxes';

type EditorBlockProps = {
  placeholder: PlaceholderParams;
  node: CompositionComponentNode;
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
  const { node, componentId, wrapperProps, label, elementToRender } = useComponent({
    node: rawNode,
    resolveDesignValue,
    renderDropzone,
    userIsDragging,
  });

  const coordinates = useSelectedInstanceCoordinates({ node });

  const isContainer = node.data.blockId === CONTENTFUL_COMPONENTS.container.id;
  const isSingleColumn = node.data.blockId === CONTENTFUL_COMPONENTS.singleColumn.id;
  const isAssemblyBlock = node.type === ASSEMBLY_BLOCK_NODE_TYPE;
  const isAssembly = node.type === ASSEMBLY_NODE_TYPE;
  const isStructureComponent = isContentfulStructureComponent(node.data.blockId);
  const isRootComponent = zoneId === ROOT_ID;

  const enableRootHitboxes = isRootComponent && !draggingNewComponent;

  const onClick = (e: React.SyntheticEvent<Element, Event>) => {
    e.stopPropagation();

    if (!userIsDragging) {
      setSelectedNodeId(node.data.id);
      // if it is the assembly directly we just want to select it as a normal component
      if (isAssembly) {
        sendMessage(OUTGOING_EVENTS.ComponentSelected, {
          nodeId: node.data.id,
        });
        return;
      }

      sendMessage(OUTGOING_EVENTS.ComponentSelected, {
        assembly: node.data.assembly,
        nodeId: node.data.id,
      });
    }
  };

  if (node.data.blockId === CONTENTFUL_COMPONENTS.singleColumn.id) {
    return (
      <>
        <DraggableChildComponent
          elementToRender={elementToRender}
          label={label || 'No Label Specified'}
          id={componentId}
          index={index}
          isAssemblyBlock={isAssemblyBlock}
          isDragDisabled={isSingleColumn}
          isSelected={selectedNodeId === componentId}
          userIsDragging={userIsDragging}
          isContainer={isContainer}
          blockId={node.data.blockId}
          coordinates={coordinates!}
          wrapperProps={wrapperProps}
          onClick={onClick}
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
      label={label || 'No Label Specified'}
      id={componentId}
      index={index}
      isAssemblyBlock={isAssemblyBlock}
      isDragDisabled={isAssemblyBlock}
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
