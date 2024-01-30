import React, { ElementType, useCallback, useEffect, useState } from 'react';
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
  CONTENTFUL_COLUMNS_ID,
} from '@contentful/experience-builder-core/constants';
import { RenderDropzoneFunction } from './Dropzone.types';
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
  isAssembly: boolean,
  blockId: string = ''
) {
  if (isAssembly) {
    return false;
  }

  if (blockId === CONTENTFUL_COLUMNS_ID) {
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
  const draggedItem = useDraggedItemStore((state) => state.draggedItem);
  const tree = useTreeStore((state) => state.tree);
  const placeholderStyle = usePlaceholderStyleStore((state) => state.style);
  const hoveringSection = useZoneStore((state) => state.hoveringSection);
  const hoveringZone = useZoneStore((state) => state.hoveringZone);
  const setHoveringZone = useZoneStore((state) => state.setHoveringZone);
  const addSectionWithZone = useZoneStore((state) => state.addSectionWithZone);
  const content = node?.children || tree.root?.children || [];
  const [singleChildDirection, setSingleChildDirection] = useState<'vertical' | 'horizontal'>(
    'horizontal'
  );

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

  const isAssembly =
    DESIGN_COMPONENT_NODE_TYPES.includes(node?.type || '') ||
    ASSEMBLY_NODE_TYPES.includes(node?.type || '');

  const draggingRootZone = draggedSourceId === ROOT_ID;

  const draggingNewComponent = !!draggedSourceId?.startsWith('component-list');

  const isEmptyCanvas = isRootZone && !content.length;

  const direction = useDropzoneDirection({ resolveDesignValue, node, zoneId });

  const showDirectionChooser = !isRootZone && content.length === 1;

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

  // console.log(droppableId);

  // Don't trigger the dropzone when it's the root because then the only hit boxes that show up will be root level zones
  // Exception 1: If it comes from the component list (because we want the component list components to work for all zones
  // Exception 2: If it's a child of a root level zone (because we want to be able to re-order root level containers)
  const isNotDroppable =
    zoneId === ROOT_ID && draggedSourceId !== 'component-list' && draggingParentIds.length !== 0;

  // return showDirectionChooser ? (
  //   content.map((item, i) => {
  //     return (
  //       <InferDirection
  //         node={item}
  //         zoneId={zoneId}
  //         key={i}
  //         resolveDesignValue={resolveDesignValue}
  //       />
  //     );
  //   })
  // ) : (

  // if (showDirectionChooser) {
  //   return (
  //     <InferDirection droppableId={droppableId} isDragging={userIsDragging} >
  //       {content.map((item, i) => {
  //         const componentId = item.data.id;
  //         return (
  //           <EditorBlock
  //             index={i}
  //             parentSectionId={sectionId}
  //             zoneId={zoneId}
  //             key={componentId}
  //             userIsDragging={userIsDragging}
  //             draggingNewComponent={draggingNewComponent}
  //             node={item}
  //             resolveDesignValue={resolveDesignValue}
  //           />
  //         );
  //       })}
  //     </InferDirection>
  //   );
  // }

  return (
    <Droppable
      droppableId={droppableId}
      direction={showDirectionChooser ? singleChildDirection : direction}
      isDropDisabled={!dropEnabled || isNotDroppable || !showDirectionChooser}>
      {(provided, snapshot) => (
        <WrapperComponent
          data-wrapper="true"
          {...(provided || { droppableProzps: {} }).droppableProps}
          ref={provided?.innerRef}
          id={droppableId}
          style={{
            pointerEvents: showDirectionChooser && 'all',
            flexDirection: showDirectionChooser
              ? singleChildDirection === 'vertical'
                ? 'column'
                : 'row'
              : '',
          }}
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
          // node={node}
          onMouseOver={(e) => {
            e.stopPropagation();
            setHoveringZone(zoneId);
          }}
          onMouseOut={() => {
            setHoveringZone('');
          }}
          onMouseMove={(e: React.MouseEvent) => {
            if (showDirectionChooser && userIsDragging) {
              const currentTarget = e.currentTarget as HTMLElement;
              const queryStr = `[data-ctfl-draggable-id]`;
              const element = currentTarget.querySelector(queryStr);
              console.log({ queryStr });
              if (element) {
                const direction = getMousePosition(e.nativeEvent, element);
                if (direction === 'left' || direction === 'right') {
                  setSingleChildDirection('horizontal');
                } else {
                  setSingleChildDirection('vertical');
                }
                console.log(
                  'direction',
                  direction === 'left' || direction === 'right' ? 'horizontal' : 'vertical'
                );
                // console.log(e.currentTarget.style.flexDirection);
              }
            }
          }}
          {...rest}>
          {isEmptyCanvas ? (
            <EmptyContainer isDragging={isRootZone && userIsDragging} />
          ) : showDirectionChooser ? (
            <InferDirection isDragging={userIsDragging}>
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
                    renderDropzone={renderDropzone}
                  />
                );
              })}
            </InferDirection>
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
                    renderDropzone={renderDropzone}
                  />
                );
              })}
              {provided?.placeholder}
              {snapshot?.isDraggingOver && !isEmptyCanvas && !showDirectionChooser && (
                <div data-ctfl-placeholder style={placeholderStyle} />
              )}
            </>
          )}
        </WrapperComponent>
      )}
    </Droppable>
  );
}

function getDirection(event: MouseEvent, element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  console.log({ x, y, rect });

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

function getMousePosition(event: MouseEvent, element: HTMLElement): string {
  const rect = element.getBoundingClientRect();
  const x = event.clientX; // - rect.left;
  const y = event.clientY; // - rect.top;

  if (x < rect.left) {
    return 'left';
    if (y > rect.height / 2) {
      return 'below-right';
    } else {
      return 'above-right';
    }
  } else if (x > rect.right) {
    return 'right';
    if (y > rect.height / 2) {
      return 'below-left';
    } else {
      return 'above-left';
    }
  } else {
    return 'center';
  }
}
