import React, { ElementType, useCallback, useMemo } from 'react';
import type {
  ResolveDesignValueType,
  DragWrapperProps,
  DesignValue,
} from '@contentful/experiences-core/types';
import { EditorBlock } from './EditorBlock';
import { ComponentData } from '@/types/Config';
import { useTreeStore } from '@/store/tree';
import styles from './styles.module.css';
import classNames from 'classnames';
import { ROOT_ID } from '@/types/constants';
import { EmptyContainer } from '@components/EmptyContainer/EmptyContainer';
import { ASSEMBLY_NODE_TYPE } from '@contentful/experiences-core/constants';
import { RenderDropzoneFunction } from './Dropzone.types';

type DropzoneProps = {
  node: ComponentData;
  slotId?: string;
  resolveDesignValue?: ResolveDesignValueType;
  className?: string;
  // TODO: Can we drop the wrapper component?
  WrapperComponent?: ElementType | string;
  dragProps?: DragWrapperProps;
  wrappingPatternIds?: Set<string>;
};

export function Dropzone({
  node,
  slotId,
  resolveDesignValue,
  className,
  WrapperComponent = 'div',
  wrappingPatternIds: parentWrappingPatternIds = new Set(),
}: DropzoneProps) {
  const tree = useTreeStore((state) => state.tree);
  const isRootNode = node.data.id === ROOT_ID;

  const isEmptyCanvas = isRootNode && !node.children.length;
  const isRootAssembly = node?.type === ASSEMBLY_NODE_TYPE;

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

  // TODO: Can we replace this recursive logic with composition?
  // To avoid a circular dependency, we create the recursive rendering function here and trickle it down
  const renderDropzone: RenderDropzoneFunction = useCallback(
    (node, props) => {
      return (
        <Dropzone
          node={node}
          resolveDesignValue={resolveDesignValue}
          wrappingPatternIds={wrappingPatternIds}
          {...props}
        />
      );
    },
    [wrappingPatternIds, resolveDesignValue],
  );

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
    <WrapperComponent
      data-ctfl-node-id={node.data.id}
      data-ctfl-slot-id={slotId}
      className={classNames(styles.Dropzone, className, {
        [styles.isEmptyCanvas]: isEmptyCanvas,
        [styles.isRoot]: isRootNode,
        [styles.isEmptyZone]: !node.children.length,
        [styles.isSlot]: Boolean(slotId),
        [styles.fullHeight]: isPatternWrapperComponentFullHeight,
        [styles.fullWidth]: isPatternWrapperComponentFullWidth,
      })}>
      {isEmptyCanvas ? (
        <EmptyContainer />
      ) : (
        node.children
          .filter((node) => node.data.slotId === slotId)
          .map((item) => (
            <EditorBlock
              key={item.data.id}
              node={item}
              resolveDesignValue={resolveDesignValue}
              wrappingPatternIds={wrappingPatternIds}
              renderDropzone={renderDropzone}
            />
          ))
      )}
    </WrapperComponent>
  );
}
