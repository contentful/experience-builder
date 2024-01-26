import React, { ElementType, useEffect, useMemo, useState } from 'react';
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
import { EmptyContainer } from '@components/EmptyContainer/EmptyContainer';
import { getZoneParents } from '@/utils/zone';
import { useZoneStore } from '@/store/zone';
import { useDropzoneDirection } from '@/hooks/useDropzoneDirection';
import {
  DESIGN_COMPONENT_NODE_TYPES,
  ASSEMBLY_NODE_TYPES,
} from '@contentful/experience-builder-core/constants';
import InferDirection from './InferDirection';

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

  if (draggingNewComponent) {
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

  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('vertical');

  // const direction = useDropzoneDirection({ resolveDesignValue, node, zoneId });

  const hasChildren = !!content.length;

  const showDirectionChooser = !isRootZone && content.length === 1;

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

  function getQuadrant(event: MouseEvent, element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x > rect.width / 2) {
      if (y > rect.height / 2) {
        return 4;
      } else {
        return 1;
      }
    } else {
      if (y > rect.height / 2) {
        return 3;
      } else {
        return 2;
      }
    }
  }

  // console.log('direction', direction);

  return showDirectionChooser ? (
    content.map((item, i) => {
      return (
        <InferDirection
          key={`idid-${i}`}
          zoneId={zoneId}
          node={item}
          resolveDesignValue={resolveDesignValue}
        />
      );
    })
  ) : (
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
            onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              setHoveringZone(zoneId);
            }}
            onMouseOut={() => {
              setHoveringZone('');
            }}
            onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
              // console.log({ target: e.target, e, rect: e.target.getBoundingClientRect() });
              // const rect = e.target.getBoundingClientRect();
              // const x = e.clientX - rect.left; //x position within the element.
              // const y = e.clientY - rect.top; //y position within the element.
              // console.log('Left? : ' + x + ' ; Top? : ' + y + '.');
              if (showDirectionChooser && userIsDragging) {
                const quadrant = getQuadrant(e.nativeEvent, e.currentTarget);
                const isHorizontal = quadrant === 2 || quadrant === 3;
                console.log({ isHorizontal, quadrant, showDirectionChooser });
              }
              // setDirection(quadrant === 2 || quadrant === 3 ? 'horizontal' : 'vertical');
            }}
            {...rest}>
            {isEmptyCanvas ? (
              <EmptyContainer isDragging={isRootZone && userIsDragging} />
            ) : (
              <>
                {content.map((item, i) => {
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
                })}
              </>
            )}
            {provided?.placeholder}
            {snapshot?.isDraggingOver && !isEmptyCanvas && hasChildren && (
              <div data-ctfl-placeholder style={placeholderStyle} />
            )}
          </WrapperComponent>
        );
      }}
    </Droppable>
  );
}
