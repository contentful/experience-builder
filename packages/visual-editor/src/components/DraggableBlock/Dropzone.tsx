import React, { ElementType, useCallback, useMemo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { EntityStoreBase, isComponentAllowedOnRoot } from '@contentful/experiences-core';
import type {
  ResolveDesignValueType,
  DragWrapperProps,
  DesignValue,
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
import {
  ASSEMBLY_NODE_TYPE,
  ASSEMBLY_NODE_TYPES,
  CONTENTFUL_COMPONENTS,
} from '@contentful/experiences-core/constants';
import { RenderDropzoneFunction } from './Dropzone.types';
import { EditorBlockClone } from './EditorBlockClone';
import { DropzoneClone } from './DropzoneClone';
import { parseZoneId } from '@/utils/zone';
import { getHtmlComponentProps, getHtmlDragProps } from '@/utils/getComponentProps';

type DropzoneProps = {
  zoneId: string;
  node?: ComponentData;
  resolveDesignValue?: ResolveDesignValueType;
  className?: string;
  WrapperComponent?: ElementType | string;
  dragProps?: DragWrapperProps;
  wrappingPatternIds?: Set<string>;
  entityStore: EntityStoreBase;
  areEntitiesFetched: boolean;
};

export function Dropzone({
  node,
  zoneId,
  resolveDesignValue,
  className,
  WrapperComponent = 'div',
  dragProps,
  entityStore,
  areEntitiesFetched,
  wrappingPatternIds: parentWrappingPatternIds = new Set(),
  ...rest
}: DropzoneProps) {
  const userIsDragging = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const draggedItem = useDraggedItemStore((state) => state.draggedItem);
  const isDraggingNewComponent = useDraggedItemStore((state) => Boolean(state.componentId));
  const isHoveringZone = useZoneStore((state) => state.hoveringZone === zoneId);
  const tree = useTreeStore((state) => state.tree);
  const content = node?.children || tree.root?.children || [];
  const { slotId } = parseZoneId(zoneId);

  const direction = useDropzoneDirection({ resolveDesignValue, node, zoneId });

  const draggedDestinationId = draggedItem && draggedItem.destination?.droppableId;

  const draggedNode = useMemo(() => {
    if (!draggedItem) return;
    return getItem({ id: draggedItem.draggableId }, tree);
  }, [draggedItem, tree]);

  const isRootZone = zoneId === ROOT_ID;
  const isDestination = draggedDestinationId === zoneId;
  const isEmptyCanvas = isRootZone && !content.length;
  const isAssembly = ASSEMBLY_NODE_TYPES.includes(node?.type || '');
  const isRootAssembly = node?.type === ASSEMBLY_NODE_TYPE;
  const htmlDraggableProps = getHtmlDragProps(dragProps);
  const htmlProps = getHtmlComponentProps(rest);

  const wrappingPatternIds = useMemo(() => {
    // On the top level, the node is not defined. If the root blockId is not the default string,
    // we assume that it is the entry ID of the experience/ pattern to properly detect circular dependencies
    if (!node && tree.root.data.blockId && tree.root.data.blockId !== ROOT_ID) {
      return new Set([tree.root.data.blockId, ...parentWrappingPatternIds]);
    }
    if (isRootAssembly && node?.data.blockId) {
      return new Set([node.data.blockId, ...parentWrappingPatternIds]);
    }
    return parentWrappingPatternIds;
  }, [isRootAssembly, node, parentWrappingPatternIds, tree.root.data.blockId]);

  // To avoid a circular dependency, we create the recursive rendering function here and trickle it down
  const renderDropzone: RenderDropzoneFunction = useCallback(
    (node, props) => {
      return (
        <Dropzone
          zoneId={node.data.id}
          entityStore={entityStore}
          node={node}
          resolveDesignValue={resolveDesignValue}
          wrappingPatternIds={wrappingPatternIds}
          areEntitiesFetched={areEntitiesFetched}
          {...props}
        />
      );
    },
    [wrappingPatternIds, resolveDesignValue, entityStore, areEntitiesFetched],
  );

  const renderClonedDropzone: RenderDropzoneFunction = useCallback(
    (node, props) => {
      return (
        <DropzoneClone
          entityStore={entityStore}
          areEntitiesFetched={areEntitiesFetched}
          zoneId={node.data.id}
          node={node}
          resolveDesignValue={resolveDesignValue}
          renderDropzone={renderClonedDropzone}
          wrappingPatternIds={wrappingPatternIds}
          {...props}
        />
      );
    },
    [resolveDesignValue, wrappingPatternIds, entityStore, areEntitiesFetched],
  );

  const isDropzoneEnabled = useMemo(() => {
    const isColumns = node?.data.blockId === CONTENTFUL_COMPONENTS.columns.id;
    const isDraggingSingleColumn =
      draggedNode?.data.blockId === CONTENTFUL_COMPONENTS.singleColumn.id;
    const isParentOfDraggedNode = node?.data.id === draggedNode?.parentId;

    // If dragging a single column, only enable the dropzone of the parent
    // columns component
    if (isDraggingSingleColumn && isColumns && isParentOfDraggedNode) {
      return true;
    }

    // If dragging a single column, disable dropzones for any component besides
    // the parent of the dragged single column
    if (isDraggingSingleColumn && !isParentOfDraggedNode) {
      return false;
    }

    // Disable dropzone for Columns component
    if (isColumns) {
      return false;
    }

    // Disable dropzone for Assembly
    if (isAssembly) {
      return false;
    }

    // Enable dropzone for the non-root hovered zones if component is not allowed on root
    if (
      !isDraggingNewComponent &&
      !isComponentAllowedOnRoot({ type: draggedNode?.type, componentId: draggedNode?.data.blockId })
    ) {
      return isHoveringZone && !isRootZone;
    }

    // Enable dropzone for the hovered zone only
    return isHoveringZone;
  }, [isAssembly, isHoveringZone, isRootZone, isDraggingNewComponent, draggedNode, node]);

  if (!resolveDesignValue) {
    return null;
  }

  const isPatternWrapperComponentFullHeight = isRootAssembly
    ? node.children.length === 1 &&
      resolveDesignValue(
        (node?.children[0]?.data.props.cfHeight as DesignValue)?.valuesByBreakpoint ?? {},
        'cfHeight',
      ) === '100%'
    : false;

  const isPatternWrapperComponentFullWidth = isRootAssembly
    ? node.children.length === 1 &&
      resolveDesignValue(
        (node?.children[0]?.data.props.cfWidth as DesignValue)?.valuesByBreakpoint ?? {},
        'cfWidth',
      ) === '100%'
    : false;

  return (
    <Droppable
      droppableId={zoneId}
      direction={direction}
      isDropDisabled={!isDropzoneEnabled}
      renderClone={(provided, snapshot, rubic) => (
        <EditorBlockClone
          entityStore={entityStore}
          areEntitiesFetched={areEntitiesFetched}
          node={content[rubic.source.index]}
          resolveDesignValue={resolveDesignValue}
          provided={provided}
          snapshot={snapshot}
          renderDropzone={renderClonedDropzone}
          wrappingPatternIds={wrappingPatternIds}
        />
      )}>
      {(provided, snapshot) => {
        return (
          <WrapperComponent
            {...(provided || { droppableProps: {} }).droppableProps}
            {...htmlDraggableProps}
            {...htmlProps}
            ref={(refNode) => {
              if (dragProps?.innerRef) {
                dragProps.innerRef(refNode);
              }
              provided?.innerRef(refNode);
            }}
            id={zoneId}
            data-ctfl-zone-id={zoneId}
            data-ctfl-slot-id={slotId}
            className={classNames(dragProps?.className, styles.Dropzone, className, {
              [styles.isEmptyCanvas]: isEmptyCanvas,
              [styles.isDragging]: userIsDragging,
              [styles.isDestination]: isDestination && !isAssembly,
              [styles.isRoot]: isRootZone,
              [styles.isEmptyZone]: !content.length,
              [styles.isSlot]: Boolean(slotId),
              [styles.fullHeight]: isPatternWrapperComponentFullHeight,
              [styles.fullWidth]: isPatternWrapperComponentFullWidth,
            })}>
            {isEmptyCanvas ? (
              <EmptyContainer isDragging={isRootZone && userIsDragging} />
            ) : (
              content
                .filter((node) => node.data.slotId === slotId)
                .map((item, i) => (
                  <EditorBlock
                    entityStore={entityStore}
                    areEntitiesFetched={areEntitiesFetched}
                    placeholder={{
                      isDraggingOver: snapshot?.isDraggingOver,
                      totalIndexes: content.length,
                      elementIndex: i,
                      dropzoneElementId: zoneId,
                      direction,
                    }}
                    index={i}
                    zoneId={zoneId}
                    key={item.data.id}
                    userIsDragging={userIsDragging}
                    draggingNewComponent={isDraggingNewComponent}
                    node={item}
                    resolveDesignValue={resolveDesignValue}
                    renderDropzone={renderDropzone}
                    wrappingPatternIds={wrappingPatternIds}
                  />
                ))
            )}
            {provided?.placeholder}
            {dragProps?.ToolTipAndPlaceholder}
          </WrapperComponent>
        );
      }}
    </Droppable>
  );
}
