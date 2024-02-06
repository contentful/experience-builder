import React, { ElementType, useCallback, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { ResolveDesignValueType } from '@contentful/experience-builder-core/types';
import { EditorBlock } from './EditorBlock';
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
  CONTENTFUL_COMPONENTS,
} from '@contentful/experience-builder-core/constants';
import { RenderDropzoneFunction } from './Dropzone.types';

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
  isAssembly: boolean,
  blockId: string = ''
) {
  if (isAssembly) {
    return false;
  }

  if (blockId === CONTENTFUL_COMPONENTS.columns.id) {
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

  return userIsDragging;
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
  const userIsDragging = useDraggedItemStore((state) => state.isDraggingOnCanvas);
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

  useEffect(() => {
    addSectionWithZone(sectionId);
  }, [sectionId, addSectionWithZone]);

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
    isAssembly,
    node?.data.blockId
  );

  // To avoid a circular dependency, we create the recursive rendering function here and trickle it down
  const renderDropzone: RenderDropzoneFunction = useCallback(
    (node, props) => {
      return (
        <Dropzone
          sectionId={node.data.id}
          zoneId={node.data.id}
          node={node}
          resolveDesignValue={resolveDesignValue}
          {...props}
        />
      );
    },
    [resolveDesignValue]
  );

  if (!resolveDesignValue) {
    return null;
  }

  // Don't trigger the dropzone when it's the root because then the only hit boxes that show up will be root level zones
  // Exception 1: If it comes from the component list (because we want the component list components to work for all zones
  // Exception 2: If it's a child of a root level zone (because we want to be able to re-order root level containers)
  const isNotDroppable =
    zoneId === ROOT_ID && draggedSourceId !== 'component-list' && draggingParentIds.length !== 0;

  return (
    <Droppable
      droppableId={droppableId}
      direction={direction}
      isDropDisabled={!dropEnabled || isNotDroppable}>
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
                [styles.isExpanded]: userIsDragging,
              },
              className
            )}
            node={node}
            onMouseOver={(e) => {
              e.stopPropagation();
              setHoveringZone(zoneId);
            }}
            onMouseOut={() => {
              setHoveringZone('');
            }}
            {...rest}>
            {isEmptyCanvas ? (
              <EmptyContainer isDragging={isRootZone && userIsDragging} />
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
                    renderDropzone={renderDropzone}
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
