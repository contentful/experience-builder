import { ResolveDesignValueType } from '@/hooks/useBreakpoints';
import {
  CONTENTFUL_CONTAINER_ID,
  CompositionComponentNode,
} from '@contentful/experience-builder-core';
import React from 'react';
import styles from './styles.module.css';
import { DraggableComponent } from '../Draggable/DraggableComponent';
import { sendMessage } from '@/communication/sendMessage';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core';
import { useSelectedInstanceCoordinates } from '@/hooks/useSelectedInstanceCoordinates';
import { useEditorStore } from '@/store/editor';
import { useComponent } from '@/hooks/useComponent';
import { useZoneStore } from '@/store/zone';

type VisualEditorBlockProps = {
  node: CompositionComponentNode;
  index: number;
  userIsDragging: boolean;
  draggingNewComponent: boolean | undefined;
  setUserWillDrag: (bool: boolean) => void;
  resolveDesignValue: ResolveDesignValueType;
  areEntitiesFetched: boolean;
  zoneId: string;
  parentSectionId: string;
};

const EditorBlock: React.FC<VisualEditorBlockProps> = ({
  node,
  resolveDesignValue,
  areEntitiesFetched,
  draggingNewComponent,
  setUserWillDrag,
  index,
  zoneId,
  parentSectionId,
  userIsDragging,
}) => {
  useSelectedInstanceCoordinates({ node });

  const setHoveringZone = useZoneStore((state) => state.setHoveringZone);
  const setHoveringSection = useZoneStore((state) => state.setHoveringSection);
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const { componentId, props, label, Render } = useComponent({
    node,
    areEntitiesFetched,
    resolveDesignValue,
  });

  const sectionsWithZone = useZoneStore((state) => state.sectionsWithZones);

  const containsZone = sectionsWithZone[componentId];

  return (
    <DraggableComponent
      label={label || 'No Label Specified'}
      id={`draggable-${componentId}`}
      index={index}
      isSelected={selectedNodeId === componentId}
      userIsDragging={userIsDragging}
      isLocked={userIsDragging}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedNodeId(componentId);
        sendMessage(OUTGOING_EVENTS.ComponentSelected, {
          nodeId: componentId,
        });
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        setUserWillDrag(true);
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
        setUserWillDrag(false);
      }}
      onMouseOver={(e) => {
        e.stopPropagation();

        if (containsZone) {
          setHoveringSection(componentId);
        } else {
          setHoveringSection(parentSectionId);
        }
        setHoveringZone(zoneId);
      }}
      onMouseOut={() => {
        setHoveringZone('');
      }}
      style={{
        pointerEvents: userIsDragging && draggingNewComponent ? 'all' : undefined,
        width: node.data.blockId === CONTENTFUL_CONTAINER_ID ? '100%' : 'auto',
      }}>
      <Render {...props} />

      {/* Hitboxes allow users to add a section between 2 components */}
      <div
        className={styles.hitbox}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHoveringZone(zoneId);
          setHoveringSection(parentSectionId);
        }}
      />
    </DraggableComponent>
  );
};

export default EditorBlock;
