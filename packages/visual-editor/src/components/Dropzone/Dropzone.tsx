import React, { ElementType, useEffect, useMemo, useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type {
  CompositionComponentNode,
  ResolveDesignValueType,
} from '@contentful/experience-builder-core/types';
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

  if (draggingNewComponent) {
    return hoveringOverSection;
  }

  // if (draggingRootZone) {
  //   return isRootZone;
  // }

  return draggingOverArea;
}

const createArrayTreeByLevels = (tree: any) => {
  const levels = [] as CompositionComponentNode[][];
  const queue = [{ node: tree.root, level: 0 }];

  while (queue.length > 0) {
    const { node, level } = queue.shift() as { node: CompositionComponentNode; level: number };

    // Initialize the level in the levels array if it hasn't been already
    if (!levels[level]) {
      levels[level] = [];
    }

    // Add the node to the appropriate level
    levels[level].push(node.data.id);

    // Add all children of the current node to the queue
    if (node.children) {
      for (const child of node.children) {
        queue.push({ node: child, level: level + 1 });
      }
    }
  }
  return levels;
};

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
  console.log('hoveringZone', hoveringZone);
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

  const [currentHoveringSectionId, setCurrentHoveringSectionId] = useState('');

  // console.log("TREE BY LEVELS", treeByLevels)

  useEffect(() => {
    addSectionWithZone(sectionId);
  }, [sectionId, addSectionWithZone]);

  const draggingOverArea = useMemo(() => {
    const treeByLevels = createArrayTreeByLevels(tree);

    if (!userIsDragging) {
      return false;
    }

    // return treeByLevels.reduce((v1, v2))

    for (let i = treeByLevels.length - 1; i >= 0; i--) {
      const nodeIds = treeByLevels[i];
      for (const nodeId of nodeIds) {
        if (nodeId === 'tNINTcU9r5Xq9EGkvS503') {
          console.log('We got a hit');
          return true;
        }
      }
    }

    return false;
    // return draggingParentIds[0] === zoneId;
  }, [tree, userIsDragging, draggingParentIds, zoneId]);

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
              console.log('hoveringZone', hoveringZone);
              console.log('currentHoveringSectionId', currentHoveringSectionId);
              setHoveringZone(zoneId);
            }}
            onMouseOut={() => {}}
            {...rest}>
            {isEmptyCanvas ? (
              <EmptyEditorContainer isDragging={isRootZone && userIsDragging} />
            ) : (
              content.map((item, i) => {
                const componentId = item.data.id;

                return (
                  <EditorBlock
                    index={i}
                    onSectionHoverIdChange={(value) => setCurrentHoveringSectionId(value)}
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
