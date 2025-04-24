import React, { ElementType } from 'react';
import type { ResolveDesignValueType, DragWrapperProps } from '@contentful/experiences-core/types';
import { ComponentData } from '@/types/Config';
import { useTreeStore } from '@/store/tree';
import styles from './styles.module.css';
import classNames from 'classnames';
import { ROOT_ID } from '@/types/constants';
import { RenderDropzoneFunction } from './Dropzone.types';
import { EditorBlockClone } from './EditorBlockClone';
import { parseZoneId } from '@/utils/zone';
import { getHtmlComponentProps, getHtmlDragProps } from '@/utils/getComponentProps';
import { EntityStoreBase } from '@contentful/experiences-core';

type DropzoneProps = {
  zoneId: string;
  entityStore: EntityStoreBase;
  node?: ComponentData;
  resolveDesignValue?: ResolveDesignValueType;
  className?: string;
  WrapperComponent?: ElementType | string;
  renderDropzone: RenderDropzoneFunction;
  dragProps?: DragWrapperProps;
  wrappingPatternIds: Set<string>;
};

export function DropzoneClone({
  node,
  entityStore,
  zoneId,
  resolveDesignValue,
  WrapperComponent = 'div',
  renderDropzone,
  dragProps,
  wrappingPatternIds,
  ...rest
}: DropzoneProps) {
  const tree = useTreeStore((state) => state.tree);
  const content = node?.children || tree.root?.children || [];
  const { slotId } = parseZoneId(zoneId);
  const htmlDraggableProps = getHtmlDragProps(dragProps);
  const htmlProps = getHtmlComponentProps(rest);

  const isRootZone = zoneId === ROOT_ID;

  if (!resolveDesignValue) {
    return null;
  }

  return (
    <WrapperComponent
      {...htmlDraggableProps}
      {...htmlProps}
      className={classNames(
        dragProps?.className,
        styles.Dropzone,
        styles.DropzoneClone,
        rest.className,
        {
          [styles.isRoot]: isRootZone,
          [styles.isEmptyZone]: !content.length,
        },
      )}
      data-ctfl-slot-id={slotId}
      ref={(refNode) => {
        if (dragProps?.innerRef) {
          dragProps.innerRef(refNode);
        }
      }}>
      {content
        .filter((node) => node.data.slotId === slotId)
        .map((item) => {
          const componentId = item.data.id;

          return (
            <EditorBlockClone
              entityStore={entityStore}
              key={componentId}
              node={item}
              resolveDesignValue={resolveDesignValue}
              renderDropzone={renderDropzone}
              wrappingPatternIds={wrappingPatternIds}
            />
          );
        })}
    </WrapperComponent>
  );
}
