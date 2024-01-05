import React, { ElementType, useEffect, useMemo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { ResolveDesignValueType } from '@contentful/experience-builder-core/types';
import EditorBlock from './EditorBlock';
import { ComponentData } from '@/types/Config';
import { useTreeStore } from '@/store/tree';
import { useDraggedItemStore } from '@/store/draggedItem';
import { usePlaceholderStyleStore } from '@/store/placeholderStyle';
import styles from './styles.module.css';
import classNames from 'classnames';
import { ROOT_ID } from '@/types/constants';
import { EmptyEditorContainer } from '@components/EmptyContainer/EmptyContainer';
import { getZoneParents } from '@/utils/zone';
import { useZoneStore } from '@/store/zone';
import { useDropZoneDirection } from '@/hooks/useDropZoneDirection';
import { DESIGN_COMPONENT_NODE_TYPES } from '@contentful/experience-builder-core/constants';

type DropZoneProps = {
  zoneId: string;
  node?: ComponentData;
  resolveDesignValue?: ResolveDesignValueType;
  className?: string;
  sectionId: string;
  WrapperComponent?: ElementType | string;
};

function isDropEnabled(
  isEmptyCanvas: boolean,
  userIsDragging: boolean,
  draggingNewComponent: boolean,
  hoveringOverSection: boolean,
  draggingRootZone: boolean,
  isRootZone: boolean,
  draggingOverArea: boolean,
  isDesignComponent: boolean
) {
  if (isDesignComponent) {
    return false;
  }

  if (!userIsDragging) {
    return false;
  }

  if (isEmptyCanvas) {
    return true;
  }

  if (draggingNewComponent) {
    return hoveringOverSection;
  }

  if (draggingRootZone) {
    return isRootZone;
  }

  return draggingOverArea;
}

export function DropZone({
  node,
  zoneId,
  sectionId,
  resolveDesignValue,
  className,
  WrapperComponent = 'div',
  ...rest
}: DropZoneProps) {
  const draggedItem = useDraggedItemStore((state) => state.draggedItem);
  const tree = useTreeStore((state) => state.tree);
  const placeholderStyle = usePlaceholderStyleStore((state) => state.style);
  const hoveringSection = useZoneStore((state) => state.hoveringSection);
  const hoveringZone = useZoneStore((state) => state.hoveringZone);
  const setHoveringZone = useZoneStore((state) => state.setHoveringZone);
  const addSectionWithZone = useZoneStore((state) => state.addSectionWithZone);
  const content = node?.children || tree.root?.children || [];

  const droppableId = zoneId;
  const isRootZone = zoneId === ROOT_ID;

  const draggedSourceId = draggedItem && draggedItem.source.droppableId;
  const draggedDestinationId = draggedItem && draggedItem.destination?.droppableId;
  const draggingParentIds = getZoneParents(draggedSourceId || '');

  const hoveringRootZone = hoveringSection ? hoveringSection === zoneId : isRootZone;
  const hoveringOverZone = hoveringZone === zoneId;

  const isDestination = draggedDestinationId === zoneId;
  const hoveringOverSection = hoveringSection ? hoveringSection === sectionId : isRootZone;

  const userIsDragging = !!draggedItem;

  useEffect(() => {
    addSectionWithZone(sectionId);
  }, [sectionId, addSectionWithZone]);

  const draggingOverArea = useMemo(() => {
    if (!userIsDragging) {
      return false;
    }

    return draggingParentIds[0] === zoneId;
  }, [userIsDragging, draggingParentIds, zoneId]);

  const isDesignComponent = DESIGN_COMPONENT_NODE_TYPES.includes(node?.type || '');

  const draggingRootZone = draggedSourceId === ROOT_ID;

  const draggingNewComponent = !!draggedSourceId?.startsWith('component-list');

  const isEmptyCanvas = isRootZone && !content.length;

  const direction = useDropZoneDirection({ resolveDesignValue, node, zoneId });

  const dropEnabled = isDropEnabled(
    isEmptyCanvas,
    userIsDragging,
    draggingNewComponent,
    hoveringOverSection,
    draggingRootZone,
    isRootZone,
    draggingOverArea,
    isDesignComponent
  );

  if (!resolveDesignValue) {
    return null;
  }

  return (
    <Droppable droppableId={droppableId} direction={direction} isDropDisabled={!dropEnabled}>
      {(provided, snapshot) => {
        return (
          <WrapperComponent
            {...(provided || { droppableProps: {} }).droppableProps}
            ref={provided?.innerRef}
            id={droppableId}
            className={classNames(
              styles.container,
              {
                [styles.isEmpty]: isEmptyCanvas,
                [styles.isRoot]: isRootZone,
                [styles.hoveringRoot]: userIsDragging && hoveringRootZone,
                [styles.isDragging]: userIsDragging && !isDesignComponent,
                [styles.isHovering]: hoveringOverZone && !userIsDragging,
                [styles.isDestination]: isDestination && !isDesignComponent,
              },
              className
            )}
            onMouseOver={(e) => {
              e.stopPropagation();
              setHoveringZone(zoneId);
            }}
            onMouseOut={() => {
              setHoveringZone('');
            }}
            {...rest}>
            {isEmptyCanvas ? (
              <EmptyEditorContainer isDragging={isRootZone && userIsDragging} />
            ) : (
              content.map((item, i) => {
                const componentId = item.data.id;

                return (
                  <EditorBlock
                    index={i}
                    parentSectionId={sectionId}
                    zoneId={zoneId}
                    key={componentId}
                    userIsDragging={userIsDragging}
                    draggingNewComponent={draggingNewComponent}
                    node={item}
                    resolveDesignValue={resolveDesignValue}
                  />
                );
              })
            )}
            {provided?.placeholder}
            {snapshot?.isDraggingOver && !isEmptyCanvas && (
              <div data-ctfl-placeholder style={placeholderStyle} />
            )}
          </WrapperComponent>
        );
      }}
    </Droppable>
  );
}