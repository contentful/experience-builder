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
import { useDropzoneDirection } from '@/hooks/useDropzoneDirection';
import {
  DESIGN_COMPONENT_NODE_TYPES,
  ASSEMBLY_NODE_TYPES,
} from '@contentful/experience-builder-core/constants';

type DropzoneProps = {
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
  isAssembly: boolean
) {
  if (isAssembly) {
    return false;
  }

  if (!userIsDragging) {
    return false;
  }

  if (isEmptyCanvas) {
    return true;
  }

  return hoveringOverSection;

  if (draggingNewComponent) {
    // console.log('draggingNewComponent', draggingNewComponent)
    // console.log('hoveringOverSection', hoveringOverSection)
    // return true;
    return hoveringOverSection;
  }

  if (draggingRootZone) {
    return isRootZone;
  }

  return draggingOverArea;
}

export function Dropzone({
  node,
  zoneId,
  sectionId,
  resolveDesignValue,
  className,
  WrapperComponent = 'div',
  ...rest
}: DropzoneProps) {
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

  // const hoveringRootZone = hoveringSection === ROOT_ID ?? false;
  // const hoveringOverZone = hoveringZone === zoneId;

  // const isDestination = draggedDestinationId === zoneId;
  // const hoveringOverSection = hoveringSection !== ROOT_ID ?? false;
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

  const isAssembly =
    DESIGN_COMPONENT_NODE_TYPES.includes(node?.type || '') ||
    ASSEMBLY_NODE_TYPES.includes(node?.type || '');

  const draggingRootZone = draggedSourceId === ROOT_ID;

  const draggingNewComponent = !!draggedSourceId?.startsWith('component-list');

  const isEmptyCanvas = isRootZone && !content.length;

  const direction = useDropzoneDirection({ resolveDesignValue, node, zoneId });

  const dropEnabled = isDropEnabled(
    isEmptyCanvas,
    userIsDragging,
    draggingNewComponent,
    hoveringOverSection,
    draggingRootZone,
    isRootZone,
    draggingOverArea,
    isAssembly
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
                [styles.isDragging]: userIsDragging && !isAssembly,
                [styles.isHovering]: hoveringOverZone && !userIsDragging,
                [styles.isDestination]: isDestination && !isAssembly,
              },
              className
            )}
            onMouseOver={(e) => {
              e.stopPropagation();
              console.log('zoneId OVER', zoneId)
              setHoveringZone(zoneId);
            }}
            onMouseOut={() => {
              console.log('zoneId OUT', zoneId)
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
