import React from 'react';
import styles from './styles.module.css';
import { DraggableComponent } from '../Draggable/DraggableComponent';
import { sendMessage } from '@contentful/experience-builder-core';
import { useSelectedInstanceCoordinates } from '@/hooks/useSelectedInstanceCoordinates';
import { useEditorStore } from '@/store/editor';
import { useComponent } from '@/hooks/useComponent';
import { useZoneStore } from '@/store/zone';
import classNames from 'classnames';
import type {
  CompositionComponentNode,
  ResolveDesignValueType,
} from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_CONTAINER_ID,
  ASSEMBLY_BLOCK_NODE_TYPE,
  OUTGOING_EVENTS,
} from '@contentful/experience-builder-core/constants';

type VisualEditorBlockProps = {
  node: CompositionComponentNode;
  index: number;
  userIsDragging: boolean;
  draggingNewComponent: boolean | undefined;
  resolveDesignValue: ResolveDesignValueType;
  zoneId: string;
  parentSectionId: string;
};

const EditorBlock: React.FC<VisualEditorBlockProps> = ({
  node: rawNode,
  resolveDesignValue,
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
  });

  useSelectedInstanceCoordinates({ node });

  const sectionsWithZone = useZoneStore((state) => state.sectionsWithZones);

  const isContainer = node.data.blockId === CONTENTFUL_CONTAINER_ID;
  const containsZone = sectionsWithZone[componentId];

  const isAssemblyBlock = node.type === ASSEMBLY_BLOCK_NODE_TYPE;

  return (
    <DraggableComponent
      label={label || 'No Label Specified'}
      id={`draggable-${componentId}`}
      index={index}
      isAssemblyBlock={isAssemblyBlock}
      isDragDisabled={isAssemblyBlock}
      isSelected={selectedNodeId === componentId}
      userIsDragging={userIsDragging}
      className={classNames({
        [styles.fullWidth]: isContainer && !wrapperProps.isFixedWidth,
        [styles.fixedWidth]: isContainer && wrapperProps.isFixedWidth,
      })}
      onClick={(e) => {
        e.stopPropagation();

        if (isAssemblyBlock && !containsZone) {
          // Readonly components in an assembly cannot be selected
          return;
        }
        const nodeId = isAssemblyBlock ? parentSectionId : componentId;
        setSelectedNodeId(nodeId);
        sendMessage(OUTGOING_EVENTS.ComponentSelected, {
          nodeId,
        });
      }}
      onMouseOver={(e) => {
        e.stopPropagation();
        if (containsZone) {
          setHoveringSection(componentId);
          console.log('hoveringSection zone', componentId);
        } else {
          setHoveringSection(parentSectionId);
          console.log('hoveringSection parent', parentSectionId);
        }
        setHoveringZone(zoneId);
      }}
      onMouseOut={() => {
        setHoveringZone('');
      }}
      style={{
        pointerEvents: userIsDragging && draggingNewComponent ? 'all' : undefined,
      }}>
      {elementToRender}

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

export default EditorBlock;
