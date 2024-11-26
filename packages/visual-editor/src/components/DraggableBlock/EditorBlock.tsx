import React, { useMemo, useRef } from 'react';
import { sendMessage } from '@contentful/experiences-core';
import { useSelectedInstanceCoordinates } from '@/hooks/useSelectedInstanceCoordinates';
import { useEditorStore } from '@/store/editor';
import { useComponent } from '@/hooks/useComponent';
import type {
  ExperienceTreeNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import { CONTENTFUL_COMPONENTS, OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import { RenderDropzoneFunction } from './Dropzone.types';
import { Draggable } from '@hello-pangea/dnd';
import Placeholder, { PlaceholderParams } from '@/components/DraggableHelpers/Placeholder';
import Hitboxes from '@/components/DraggableHelpers/Hitboxes';
import Tooltip from './Tooltip';
import useDraggablePosition from '@/hooks/useDraggablePosition';
import { DraggablePosition } from '@/types/constants';
import { useDraggedItemStore } from '@/store/draggedItem';
import classNames from 'classnames';
import styles from './styles.module.css';
import { parseZoneId } from '@/utils/zone';
import useSingleColumn from '@/hooks/useSingleColumn';

function getStyle(style, snapshot) {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  };
}

type EditorBlockProps = {
  placeholder: PlaceholderParams;
  node: ExperienceTreeNode;
  index: number;
  userIsDragging: boolean;
  draggingNewComponent: boolean | undefined;
  resolveDesignValue: ResolveDesignValueType;
  renderDropzone: RenderDropzoneFunction;
  zoneId: string;
};

export const EditorBlock: React.FC<EditorBlockProps> = ({
  node: rawNode,
  resolveDesignValue,
  renderDropzone,
  index,
  zoneId,
  userIsDragging,
  placeholder,
}) => {
  const { slotId } = parseZoneId(zoneId);
  const ref = useRef<HTMLElement | null>(null);
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const {
    node,
    componentId,
    elementToRender,
    definition,
    isPatternNode,
    isPatternComponent,
    isNestedPattern,
  } = useComponent({
    node: rawNode,
    resolveDesignValue,
    renderDropzone,
    userIsDragging,
  });
  const { isSingleColumn, isWrapped } = useSingleColumn(node, resolveDesignValue);
  const setDomRect = useDraggedItemStore((state) => state.setDomRect);
  const isHoveredComponent = useDraggedItemStore(
    (state) => state.hoveredComponentId === componentId,
  );
  const coordinates = useSelectedInstanceCoordinates({ node });
  const displayName = node.data.displayName || rawNode.data.displayName || definition?.name;
  const testId = `draggable-${node.data.blockId ?? 'node'}`;
  const isSelected = node.data.id === selectedNodeId;
  const isContainer = node.data.blockId === CONTENTFUL_COMPONENTS.container.id;
  const isSlotComponent = Boolean(node.data.slotId);
  const isDragDisabled =
    isNestedPattern || isPatternComponent || (isSingleColumn && isWrapped) || isSlotComponent;
  const isEmptyZone = useMemo(() => {
    return !node.children.filter((node) => node.data.slotId === slotId).length;
  }, [node.children, slotId]);

  useDraggablePosition({
    draggableId: componentId,
    draggableRef: ref,
    position: DraggablePosition.MOUSE_POSITION,
  });

  const onClick = (e: React.SyntheticEvent<Element, Event>) => {
    e.stopPropagation();

    if (!userIsDragging) {
      setSelectedNodeId(node.data.id);
      // if it is the assembly directly we just want to select it as a normal component
      if (isPatternNode) {
        sendMessage(OUTGOING_EVENTS.ComponentSelected, {
          nodeId: node.data.id,
        });
        return;
      }

      sendMessage(OUTGOING_EVENTS.ComponentSelected, {
        assembly: node.data.assembly,
        nodeId: node.data.id,
      });
    }
  };

  const onMouseOver = (e: React.SyntheticEvent<Element, Event>) => {
    e.stopPropagation();
    if (userIsDragging) return;
    sendMessage(OUTGOING_EVENTS.NewHoveredElement, {
      nodeId: componentId,
    });
  };

  const onMouseDown = (e: React.SyntheticEvent<Element, Event>) => {
    if (isDragDisabled) {
      return;
    }

    e.stopPropagation();
    setDomRect(e.currentTarget.getBoundingClientRect());
  };

  const ToolTipAndPlaceholder = (
    <>
      <Tooltip
        id={componentId}
        coordinates={coordinates}
        isAssemblyBlock={isPatternNode || isPatternComponent}
        isContainer={isContainer}
        label={displayName || 'No label specified'}
      />
      <Placeholder {...placeholder} id={componentId} />
      {userIsDragging && !isPatternComponent && (
        <Hitboxes parentZoneId={zoneId} zoneId={componentId} isEmptyZone={isEmptyZone} />
      )}
    </>
  );

  return (
    <Draggable
      key={componentId}
      draggableId={componentId}
      index={index}
      isDragDisabled={isDragDisabled}
      disableInteractiveElementBlocking>
      {(provided, snapshot) =>
        elementToRender({
          dragProps: {
            ...provided.draggableProps,
            ...provided.dragHandleProps,
            'data-ctfl-draggable-id': componentId,
            'data-test-id': testId,
            innerRef: (refNode) => {
              provided?.innerRef(refNode);
              ref.current = refNode;
            },
            className: classNames(styles.DraggableComponent, {
              [styles.isAssemblyBlock]: isPatternComponent || isPatternNode,
              [styles.isDragging]: snapshot?.isDragging || userIsDragging,
              [styles.isSelected]: isSelected,
              [styles.isHoveringComponent]: isHoveredComponent,
            }),
            style: getStyle(provided.draggableProps.style, snapshot),
            onMouseDown,
            onMouseOver,
            onClick,
            ToolTipAndPlaceholder,
          },
        })
      }
    </Draggable>
  );
};
