import React, { ElementType, useCallback } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { ResolveDesignValueType } from '@contentful/experience-builder-core/types';
import { EditorBlock } from './EditorBlock';
import { ComponentData } from '@/types/Config';
import { useTreeStore } from '@/store/tree';
import { useDraggedItemStore } from '@/store/draggedItem';
import styles from './styles.module.css';
import classNames from 'classnames';
import { COMPONENT_LIST_ID, ROOT_ID } from '@/types/constants';
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
  const hoveringZone = useZoneStore((state) => state.hoveringZone);
  const tree = useTreeStore((state) => state.tree);
  const content = node?.children || tree.root?.children || [];

  const direction = useDropzoneDirection({ resolveDesignValue, node, zoneId });

  const draggedSourceId = draggedItem && draggedItem.source.droppableId;
  const draggedDestinationId = draggedItem && draggedItem.destination?.droppableId;

  const isDraggingNewComponent = !!draggedSourceId?.startsWith(COMPONENT_LIST_ID);
  const isHoveringZone = hoveringZone === zoneId;
  const isRootZone = zoneId === ROOT_ID;
  const isDestination = draggedDestinationId === zoneId;
  const isDraggingRootZone = draggedSourceId === ROOT_ID;
  const isEmptyCanvas = isRootZone && !content.length;

  const isAssembly =
    DESIGN_COMPONENT_NODE_TYPES.includes(node?.type || '') ||
    ASSEMBLY_NODE_TYPES.includes(node?.type || '');

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

  // Don't trigger the dropzone when it's the root because then the only hit boxes that show up will be root level zones
  // Exception 1: If it comes from the component list (because we want the component list components to work for all zones
  // Exception 2: If it's a child of a root level zone (because we want to be able to re-order root level containers)

  const isDropzoneEnabled = () => {
    if (node?.data.blockId === CONTENTFUL_COMPONENTS.columns.id) {
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
                [styles.isDragging]: userIsDragging && !isAssembly,
                [styles.isDestination]: isDestination && !isAssembly,
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
                    draggingRootZone={isDraggingRootZone}
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
