import { useComponent } from '@/hooks/useComponent';
import {
  CompositionComponentNode,
  ResolveDesignValueType,
} from '@contentful/experience-builder-core/types';
import { Droppable } from '@hello-pangea/dnd';
import React from 'react';
import styles from './InferDirection.module.css';
import classNames from 'classnames';
import { ROOT_ID } from '@/types/constants';
import { useZoneStore } from '@/store/zone';

interface InferDirectionProps extends React.PropsWithChildren {
  isDragging: boolean;
  // droppableId: string;
  // rest: any;
  // node: CompositionComponentNode;
  // zoneId: string;
  // resolveDesignValue: ResolveDesignValueType;
}

const InferDirection: React.FC<InferDirectionProps> = ({
  isDragging,
  // droppableId,
  children,
  // rest,
  // node: rawNode,
  // resolveDesignValue,
  // zoneId,
}) => {
  // const direction = 'vertical';

  return (
    <div
      className={classNames(styles.inferredDirectionContainer, {
        [styles.gridDragging]: isDragging,
      })}>
      <div className={styles.itemLeft}>&nbsp;</div>
      <div className={styles.itemRight}>&nbsp;</div>
      <div className={styles.itemTop}>&nbsp;</div>
      <div className={styles.itemBottom}>&nbsp;</div>
      <div className={styles.itemMain}>{children}</div>
    </div>
  );
};

export default InferDirection;

// <div
//   className={classNames(styles.inferredDirectionContainer, {
//     [styles.isDragging]: isDragging,
//   })}>
//   {children}
// </div>
