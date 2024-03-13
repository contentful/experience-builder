import React, { ElementType, useCallback } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { ResolveDesignValueType } from '@contentful/experiences-core/types';
import { EditorBlock } from './EditorBlock';
import { ComponentData } from '@/types/Config';
import { useTreeStore } from '@/store/tree';
import { useDraggedItemStore } from '@/store/draggedItem';
import styles from './styles.module.css';
import classNames from 'classnames';
import { ROOT_ID } from '@/types/constants';
import { EmptyContainer } from '@components/EmptyContainer/EmptyContainer';
import { getZoneParents } from '@/utils/zone';
import { useZoneStore } from '@/store/zone';
import { useDropzoneDirection } from '@/hooks/useDropzoneDirection';
import { PATTERN_NODE_TYPES, CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { RenderDropzoneFunction } from './Dropzone.types';
import { EditorBlockClone } from './EditorBlockClone';
import { DropzoneClone } from './DropzoneClone';

type DropzoneProps = {
  zoneId: string;
  node?: ComponentData;
  resolveDesignValue?: ResolveDesignValueType;
  className?: string;
  WrapperComponent?: ElementType | string;
};

export function Dropzone({
  node,
  zoneId,
  resolveDesignValue,
  className,
  WrapperComponent = 'div',
  ...rest
}: DropzoneProps) {
  const userIsDragging = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const draggedItem = useDraggedItemStore((state) => state.draggedItem);
  const newComponentId = useDraggedItemStore((state) => state.componentId);
  const hoveringZone = useZoneStore((state) => state.hoveringZone);
  const tree = useTreeStore((state) => state.tree);
  const content = node?.children || tree.root?.children || [];

  const direction = useDropzoneDirection({ resolveDesignValue, node, zoneId });

  const draggedSourceId = draggedItem && draggedItem.source.droppableId;
  const draggedDestinationId = draggedItem && draggedItem.destination?.droppableId;

  const isDraggingNewComponent = !!newComponentId;
  const isHoveringZone = hoveringZone === zoneId;
  const isRootZone = zoneId === ROOT_ID;
  const isDestination = draggedDestinationId === zoneId;
  const isEmptyCanvas = isRootZone && !content.length;

  const isPattern = PATTERN_NODE_TYPES.includes(node?.type || '');

  // To avoid a circular dependency, we create the recursive rendering function here and trickle it down
  const renderDropzone: RenderDropzoneFunction = useCallback(
    (node, props) => {
      return (
        <Dropzone
          zoneId={node.data.id}
          node={node}
          resolveDesignValue={resolveDesignValue}
          {...props}
        />
      );
    },
    [resolveDesignValue],
  );

  const renderClonedDropzone: RenderDropzoneFunction = useCallback(
    (node, props) => {
      return (
        <DropzoneClone
          zoneId={node.data.id}
          node={node}
          resolveDesignValue={resolveDesignValue}
          renderDropzone={renderClonedDropzone}
          {...props}
        />
      );
    },
    [resolveDesignValue],
  );

  if (!resolveDesignValue) {
    return null;
  }

  /**
   * The Rules of Dropzones
   *
   * 1. A dropzone is disabled unless the mouse is hovering over it
   *
   * 2. Dragging a new component onto the canvas has no addtional rules
   * besides rule #1
   *
   * 3. Dragging a component that is a direct descendant of the root
   * (parentId === ROOT_ID) then only the Root Dropzone is enabled
   *
   * 4. Dragging a nested component (parentId !== ROOT_ID) then the Root
   * Dropzone is disabled, all other Dropzones follow rule #1
   *
   * 5. Patterns and the SingleColumn component are always disabled
   *
   */
  const isDropzoneEnabled = () => {
    if (node?.data.blockId === CONTENTFUL_COMPONENTS.columns.id) {
      return false;
    }

    if (isPattern) {
      return false;
    }

    if (isDraggingNewComponent) {
      return isHoveringZone;
    }

    const draggingParentIds = getZoneParents(draggedSourceId || '');

    if (!draggingParentIds.length) {
      return isRootZone;
    }

    return isHoveringZone && !isRootZone;
  };

  return (
    <Droppable
      droppableId={zoneId}
      direction={direction}
      isDropDisabled={!isDropzoneEnabled()}
      renderClone={(provided, snapshot, rubic) => (
        <EditorBlockClone
          node={content[rubic.source.index]}
          resolveDesignValue={resolveDesignValue}
          provided={provided}
          snapshot={snapshot}
          renderDropzone={renderClonedDropzone}
        />
      )}>
      {(provided, snapshot) => {
        return (
          <WrapperComponent
            {...(provided || { droppableProps: {} }).droppableProps}
            ref={provided?.innerRef}
            id={zoneId}
            data-ctfl-zone-id={zoneId}
            className={classNames(
              styles.container,
              {
                [styles.isEmptyCanvas]: isEmptyCanvas,
                [styles.isDragging]: userIsDragging && !isPattern,
                [styles.isDestination]: isDestination && !isPattern,
                [styles.isRoot]: isRootZone,
                [styles.isEmptyZone]: !content.length,
              },
              className,
            )}
            node={node}
            {...rest}>
            {isEmptyCanvas ? (
              <EmptyContainer isDragging={isRootZone && userIsDragging} />
            ) : (
              content.map((item, i) => {
                const componentId = item.data.id;

                return (
                  <EditorBlock
                    placeholder={{
                      isDraggingOver: snapshot?.isDraggingOver,
                      totalIndexes: content.length,
                      elementIndex: i,
                      dropzoneElementId: zoneId,
                      direction,
                    }}
                    index={i}
                    zoneId={zoneId}
                    key={componentId}
                    userIsDragging={userIsDragging}
                    draggingNewComponent={isDraggingNewComponent}
                    node={item}
                    resolveDesignValue={resolveDesignValue}
                    renderDropzone={renderDropzone}
                  />
                );
              })
            )}
            {provided?.placeholder}
          </WrapperComponent>
        );
      }}
    </Droppable>
  );
}
