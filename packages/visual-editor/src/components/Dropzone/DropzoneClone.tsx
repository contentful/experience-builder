import React, { ElementType, useCallback } from 'react';
import type { ResolveDesignValueType } from '@contentful/experience-builder-core/types';
import { ComponentData } from '@/types/Config';
import { useTreeStore } from '@/store/tree';
import styles from './styles.module.css';
import classNames from 'classnames';
import { ROOT_ID } from '@/types/constants';

import { RenderDropzoneFunction } from './Dropzone.types';
import { EditorBlockClone } from './EditorBlockClone';

type DropzoneProps = {
  zoneId: string;
  node?: ComponentData;
  resolveDesignValue?: ResolveDesignValueType;
  className?: string;
  WrapperComponent?: ElementType | string;
};

export function DropzoneClone({
  node,
  zoneId,
  resolveDesignValue,
  className,
  WrapperComponent = 'div',
  ...rest
}: DropzoneProps) {
  const tree = useTreeStore((state) => state.tree);
  const content = node?.children || tree.root?.children || [];

  const isRootZone = zoneId === ROOT_ID;

  // To avoid a circular dependency, we create the recursive rendering function here and trickle it down
  const renderClonedDropzone: RenderDropzoneFunction = useCallback(
    (node, props) => {
      return (
        <DropzoneClone
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
      className={classNames(
        styles.container,
        {
          [styles.isRoot]: isRootZone,
          [styles.isEmptyZone]: !content.length,
        },
        className,
      )}
      node={node}
      {...rest}>
      {content.map((item) => {
        const componentId = item.data.id;

        return (
          <EditorBlockClone
            key={componentId}
            node={item}
            resolveDesignValue={resolveDesignValue}
            renderDropzone={renderClonedDropzone}
          />
        );
      })}
    </WrapperComponent>
  );
}
