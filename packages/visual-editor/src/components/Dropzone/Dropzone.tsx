import React, { ElementType, useCallback, useMemo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { isComponentAllowedOnRoot } from '@contentful/experiences-core';
import type {
  ResolveDesignValueType,
  RenderDropzoneFunction,
} from '@contentful/experiences-core/types';
import { EditorBlock } from './EditorBlock';
import { ComponentData } from '@/types/Config';
import { useTreeStore } from '@/store/tree';
import { useDraggedItemStore } from '@/store/draggedItem';
import styles from './styles.module.css';
import classNames from 'classnames';
import { ROOT_ID } from '@/types/constants';
import { EmptyContainer } from '@components/EmptyContainer/EmptyContainer';
import { getItem } from '@/utils/getItem';
import { useZoneStore } from '@/store/zone';
import { useDropzoneDirection } from '@/hooks/useDropzoneDirection';
import { ASSEMBLY_NODE_TYPES, CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { EditorBlockClone } from './EditorBlockClone';
import { DropzoneClone } from './DropzoneClone';
import { parseZoneId } from '@/utils/zone';

type DropzoneProps = {
  zoneId: string;
  node?: ComponentData;
  resolveDesignValue?: ResolveDesignValueType;
  className?: string;
  WrapperComponent?: ElementType | string;
  wrapperProps?: Record<string, unknown>;
};

export function Dropzone({
  node,
  zoneId,
  resolveDesignValue,
  className,
  WrapperComponent = 'div',
  wrapperProps,
  ...rest
}: DropzoneProps) {
  const { nodeId, slotId } = parseZoneId(zoneId);
  const userIsDragging = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const draggedItem = useDraggedItemStore((state) => state.draggedItem);
  const isDraggingNewComponent = useDraggedItemStore((state) => Boolean(state.componentId));
  const isHoveringZone = useZoneStore((state) => state.hoveringZone === zoneId);
  const tree = useTreeStore((state) => state.tree);
  const content = node?.children || tree.root?.children || [];

  // if (slotId) {
  //   console.log(`[DEBUG] Dropzone`, {
  //     slotId,
  //     zoneId,
  //     node,
  //     filtered: content.filter((node) => node.data.slotId === slotId),
  //   });
  // }

  const direction = useDropzoneDirection({ resolveDesignValue, node, zoneId });

  const draggedDestinationId = draggedItem && draggedItem.destination?.droppableId;

  const draggedBlockId = useMemo(() => {
    if (!draggedItem) return;
    return getItem({ id: draggedItem.draggableId }, tree)?.data.blockId;
  }, [draggedItem, tree]);

  const isRootZone = zoneId === ROOT_ID;
  const isDestination = draggedDestinationId === zoneId;
  const isEmptyCanvas = isRootZone && !content.length;

  const isAssembly = ASSEMBLY_NODE_TYPES.includes(node?.type || '');

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

  const isDropzoneEnabled = useMemo(() => {
    // Disable dropzone for Columns component
    if (node?.data.blockId === CONTENTFUL_COMPONENTS.columns.id) {
      return false;
    }

    // Disable dropzone for Assembly
    if (isAssembly) {
      return false;
    }

    // Enable dropzone for the non-root hovered zones if component is not allowed on root
    if (!isDraggingNewComponent && !isComponentAllowedOnRoot(draggedBlockId)) {
      return isHoveringZone && !isRootZone;
    }

    // Enable dropzone for the hovered zone only
    return isHoveringZone;
  }, [
    node?.data.blockId,
    isAssembly,
    isHoveringZone,
    isRootZone,
    isDraggingNewComponent,
    draggedBlockId,
  ]);

  if (!resolveDesignValue) {
    return null;
  }

  return (
    <Droppable
      droppableId={zoneId}
      direction={direction}
      isDropDisabled={!isDropzoneEnabled}
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
            id={nodeId}
            data-ctfl-zone-id={zoneId}
            data-ctfl-slot-id={slotId}
            className={classNames(
              styles.container,
              {
                [styles.isEmptyCanvas]: isEmptyCanvas,
                [styles.isDragging]: userIsDragging && !isAssembly,
                [styles.isDestination]: isDestination && !isAssembly,
                [styles.isRoot]: isRootZone,
                [styles.isEmptyZone]: !content.length,
              },
              className,
            )}
            node={node}
            {...wrapperProps}
            {...rest}>
            {isEmptyCanvas ? (
              <EmptyContainer isDragging={isRootZone && userIsDragging} />
            ) : (
              content
                // Filtering out based on the current slot:
                .filter((node) => node.data.slotId === slotId)
                // Rendering the children
                .map((item, i) => {
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
