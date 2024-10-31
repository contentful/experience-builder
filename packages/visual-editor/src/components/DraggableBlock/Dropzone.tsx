import React, { ElementType, useCallback } from 'react';

import type { ResolveDesignValueType, DragWrapperProps } from '@contentful/experiences-core/types';
import { EditorBlock } from './EditorBlock';
import { ComponentData } from '@/types/Config';
import { useTreeStore } from '@/store/tree';
import { useDraggedItemStore } from '@/store/draggedItem';
import styles from './styles.module.css';
import classNames from 'classnames';
import { ROOT_ID } from '@/types/constants';
import { EmptyContainer } from '@components/EmptyContainer/EmptyContainer';
import { ASSEMBLY_NODE_TYPE } from '@contentful/experiences-core/constants';
import { RenderDropzoneFunction } from './Dropzone.types';
import { parseZoneId } from '@/utils/zone';
import { getHtmlComponentProps, getHtmlDragProps } from '@/utils/getComponentProps';

type DropzoneProps = {
  zoneId: string;
  node?: ComponentData;
  resolveDesignValue?: ResolveDesignValueType;
  className?: string;
  WrapperComponent?: ElementType | string;
  dragProps?: DragWrapperProps;
};

export function Dropzone({
  node,
  zoneId,
  resolveDesignValue,
  className,
  WrapperComponent = 'div',
  dragProps,
  ...rest
}: DropzoneProps) {
  const userIsDragging = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const tree = useTreeStore((state) => state.tree);
  const content = node?.children || tree.root?.children || [];
  const { slotId } = parseZoneId(zoneId);
  const isRootZone = zoneId === ROOT_ID;
  const isEmptyCanvas = isRootZone && !content.length;
  const isRootAssembly = node?.type === ASSEMBLY_NODE_TYPE;
  const htmlDraggableProps = getHtmlDragProps(dragProps);
  const htmlProps = getHtmlComponentProps(rest);
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

  if (!resolveDesignValue) {
    return null;
  }

  return (
    <WrapperComponent
      {...htmlDraggableProps}
      {...htmlProps}
      id={zoneId}
      data-ctfl-zone-id={zoneId}
      data-ctfl-slot-id={slotId}
      className={classNames(dragProps?.className, styles.Dropzone, className, {
        [styles.isEmptyCanvas]: isEmptyCanvas,
        [styles.isDragging]: userIsDragging,
        [styles.isRoot]: isRootZone,
        [styles.isEmptyZone]: !content.length,
        [styles.isAssembly]: isRootAssembly,
        [styles.isSlot]: Boolean(slotId),
      })}>
      {isEmptyCanvas ? (
        <EmptyContainer isDragging={isRootZone && userIsDragging} />
      ) : (
        content
          .filter((node) => node.data.slotId === slotId)
          .map((item) => (
            <EditorBlock
              key={item.data.id}
              userIsDragging={userIsDragging}
              node={item}
              resolveDesignValue={resolveDesignValue}
              renderDropzone={renderDropzone}
            />
          ))
      )}
      {dragProps?.ToolTipAndPlaceholder}
    </WrapperComponent>
  );
}
