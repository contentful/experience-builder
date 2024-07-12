import React, { useMemo, useRef, useState } from 'react';
import { isContentfulStructureComponent, sendMessage } from '@contentful/experiences-core';
import { useSelectedInstanceCoordinates } from '@/hooks/useSelectedInstanceCoordinates';
import { useEditorStore } from '@/store/editor';
import { useComponent } from '@/hooks/useComponent';
import type {
  ExperienceTreeNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import {
  CONTENTFUL_COMPONENTS,
  ASSEMBLY_BLOCK_NODE_TYPE,
  OUTGOING_EVENTS,
  ASSEMBLY_NODE_TYPE,
} from '@contentful/experiences-core/constants';
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
import ResizeHandlers from '@components/DraggableHelpers/ResizeHandlers';
import { useResizeStore } from '@/store/resizeItem';
import {
  HeadingComponentDefinition,
  RichTextComponentDefinition,
  TextComponentDefinition,
} from '@contentful/experiences-components-react';
import ContentToolbar from '../DraggableHelpers/ContentToolbar';
import { sendSelectedComponentCoordinates } from '@/communication/sendSelectedComponentCoordinates';

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
  const { node, componentId, elementToRender } = useComponent({
    node: rawNode,
    resolveDesignValue,
    renderDropzone,
    userIsDragging,
    slotId,
  });
  const [editing, setEditing] = useState(false);
  const setDomRect = useDraggedItemStore((state) => state.setDomRect);
  const isHoveredComponent = useDraggedItemStore(
    (state) => state.hoveredComponentId === componentId,
  );
  const coordinates = useSelectedInstanceCoordinates({ node });
  const displayName = node.data.displayName;
  const testId = `draggable-${node.data.blockId ?? 'node'}`;
  const isSelected = node.data.id === selectedNodeId;
  const isContainer = node.data.blockId === CONTENTFUL_COMPONENTS.container.id;
  const isSingleColumn = node.data.blockId === CONTENTFUL_COMPONENTS.singleColumn.id;
  const isAssemblyBlock = node.type === ASSEMBLY_BLOCK_NODE_TYPE;
  const isAssembly = node.type === ASSEMBLY_NODE_TYPE;
  const isStructureComponent = isContentfulStructureComponent(node.data.blockId);
  const isSlotComponent = Boolean(node.data.slotId);
  const isHoveringResize = useResizeStore((state) => state.isResize);
  const isDragDisabled = isAssemblyBlock || isSingleColumn || isSlotComponent || isHoveringResize;

  const isEmptyZone = useMemo(() => {
    return !node.children.filter((node) => node.data.slotId === slotId).length;
  }, [node.children, slotId]);

  useDraggablePosition({
    draggableId: componentId,
    draggableRef: ref,
    position: DraggablePosition.MOUSE_POSITION,
  });

  const onClick = (e: React.SyntheticEvent<Element, Event>) => {
    // needs to not trigger for doubleclick
    if ((e as any)?.detail > 1) {
      return;
    }

    e.stopPropagation();
    if (!userIsDragging) {
      setSelectedNodeId(node.data.id);
      // if it is the assembly directly we just want to select it as a normal component
      if (isAssembly) {
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

  const onDoubleClick = () => {
    const editableContent = [
      TextComponentDefinition.id,
      RichTextComponentDefinition.id,
      HeadingComponentDefinition.id,
    ];

    sendSelectedComponentCoordinates(node.data.id);

    if (editableContent.includes(node.data.blockId!)) {
      const nodeElement = document.querySelector(
        `[data-cf-node-id="${node.data.id}"]`,
      ) as HTMLParagraphElement;

      if (!nodeElement) {
        return;
      }

      setEditing(true);
      nodeElement.contentEditable = 'true';
      nodeElement.style.pointerEvents = 'all !important';
      nodeElement.focus();
      nodeElement.addEventListener('input', () => {
        sendSelectedComponentCoordinates(node.data.id);
      });
      nodeElement.addEventListener('blur', (e: any) => {
        sendSelectedComponentCoordinates(node.data.id);
        nodeElement.contentEditable = 'false';
        setEditing(false);

        const content = e.target.innerText;
        console.log('::inline-content::', content);
        // send a postmessage back up to the web_app
        // call `onContentValueChanged` to update the input
      });
    }
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
        isAssemblyBlock={isAssemblyBlock}
        isContainer={isContainer}
        label={displayName || 'No label specified'}
      />
      <ResizeHandlers element={ref.current} componentId={node.data.id} />
      <Placeholder {...placeholder} id={componentId} />
      {editing && <ContentToolbar />}
      {isStructureComponent && userIsDragging && (
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
              [styles.isAssemblyBlock]: isAssemblyBlock,
              [styles.isDragging]: snapshot?.isDragging,
              [styles.isSelected]: isSelected,
              [styles.userIsDragging]: userIsDragging,
              [styles.isHoveringComponent]: isHoveredComponent,
              [styles.isEditing]: editing,
            }),
            style: getStyle(provided.draggableProps.style, snapshot),
            onMouseDown,
            onMouseOver,
            onDoubleClick,
            onClick,
            ToolTipAndPlaceholder,
            editingContent: editing,
          },
        })
      }
    </Draggable>
  );
};
