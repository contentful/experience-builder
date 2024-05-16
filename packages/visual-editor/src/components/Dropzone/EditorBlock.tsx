import React from 'react';
import { DraggableComponent } from '@components/Draggable/DraggableComponent';
import { isContentfulStructureComponent, sendMessage } from '@contentful/experiences-core';
import { useSelectedInstanceCoordinates } from '@/hooks/useSelectedInstanceCoordinates';
import { useEditorStore } from '@/store/editor';
import { useComponent } from './useComponent';
import type {
  ExperienceTreeNode,
  ResolveDesignValueType,
  RenderDropzoneFunction,
} from '@contentful/experiences-core/types';
import {
  CONTENTFUL_COMPONENTS,
  ASSEMBLY_BLOCK_NODE_TYPE,
  OUTGOING_EVENTS,
  ASSEMBLY_NODE_TYPE,
} from '@contentful/experiences-core/constants';
import { DraggableChildComponent } from '@components/Draggable/DraggableChildComponent';
import { PlaceholderParams } from '@components/Draggable/Placeholder';
import Hitboxes from './Hitboxes';
import { parseZoneId } from '@/utils/zone';

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
  index,
  zoneId,
  userIsDragging,
  placeholder,
}) => {
  const { slotId } = parseZoneId(zoneId);
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const { node, wrapperProps, definition, elementToRender } = useComponent({
    node: rawNode,
    resolveDesignValue,
    renderDropzone,
    userIsDragging,
    slotId,
  });

  const coordinates = useSelectedInstanceCoordinates({ node });

  const isContainer = node.data.blockId === CONTENTFUL_COMPONENTS.container.id;
  const isSingleColumn = node.data.blockId === CONTENTFUL_COMPONENTS.singleColumn.id;
  const isAssemblyBlock = node.type === ASSEMBLY_BLOCK_NODE_TYPE;
  const isAssembly = node.type === ASSEMBLY_NODE_TYPE;
  const isStructureComponent = isContentfulStructureComponent(node.data.blockId);
  const isEmptyZone = !node.children.filter((node) => node.data.slotId === slotId).length;

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

  const onMouseOver = (e: React.SyntheticEvent<Element, Event>) => {
    e.stopPropagation();

    if (userIsDragging) return;

    sendMessage(OUTGOING_EVENTS.NewHoveredElement, {
      nodeId: node.data.id,
    });
  };

  if (isSingleColumn) {
    return (
      <DraggableChildComponent
        elementToRender={elementToRender}
        id={node.data.id}
        index={index}
        isAssemblyBlock={isAssembly || isAssemblyBlock}
        isDragDisabled
        isSelected={selectedNodeId === node.data.id}
        userIsDragging={userIsDragging}
        isContainer={isContainer}
        blockId={node.data.blockId!}
        coordinates={coordinates!}
        wrapperProps={wrapperProps}
        onClick={onClick}
        onMouseOver={onMouseOver}
        definition={definition}
      />
    );
  }

  return (
    <DraggableComponent
      placeholder={placeholder}
      definition={definition}
      id={node.data.id}
      index={index}
      isAssemblyBlock={isAssembly || isAssemblyBlock}
      isDragDisabled={isAssemblyBlock}
      isSelected={selectedNodeId === node.data.id}
      userIsDragging={userIsDragging}
      isContainer={isContainer}
      blockId={node.data.blockId}
      coordinates={coordinates!}
      wrapperProps={wrapperProps}
      onClick={onClick}
      onMouseOver={onMouseOver}>
      {elementToRender()}
      {isStructureComponent && userIsDragging && (
        <Hitboxes parentZoneId={zoneId} zoneId={node.data.id} isEmptyZone={isEmptyZone} />
      )}
    </DraggableComponent>
  );
};
