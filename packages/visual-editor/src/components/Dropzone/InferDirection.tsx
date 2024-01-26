import { useComponent } from '@/hooks/useComponent';
import {
  CompositionComponentNode,
  ResolveDesignValueType,
} from '@contentful/experience-builder-core/types';
import { Droppable } from '@hello-pangea/dnd';
import React from 'react';
import styles from './styles.module.css';
import classNames from 'classnames';
import { ROOT_ID } from '@/types/constants';
import { useZoneStore } from '@/store/zone';

interface InferDirectionProps {
  node: CompositionComponentNode;
  zoneId: string;
  resolveDesignValue: ResolveDesignValueType;
}

const InferDirection: React.FC<InferDirectionProps> = ({
  node: rawNode,
  resolveDesignValue,
  zoneId,
}) => {
  const setHoveringZone = useZoneStore((state) => state.setHoveringZone);
  const { node, componentId, wrapperProps, label, elementToRender } = useComponent({
    node: rawNode,
    resolveDesignValue,
  });
  const isRootZone = zoneId === ROOT_ID;
  const WrapperComponent = 'div';
  return (
    <>
      <Droppable droppableId={zoneId} isDropDisabled={false}>
        {(provided, snapshot) => (
          <WrapperComponent
            {...(provided || { droppableProps: {} }).droppableProps}
            ref={provided?.innerRef}
            id={'draggable-top'}
            className={
              classNames(styles.container)
              // styles.container,
              // {
              //   [styles.isRoot]: isRootZone,
              //   [styles.hoveringRoot]: userIsDragging && hoveringRootZone,
              //   [styles.isDragging]: userIsDragging && !isAssembly,
              //   [styles.isHovering]: hoveringOverZone && !userIsDragging,
              //   [styles.isDestination]: isDestination && !isAssembly,
              // },
              // className
            }
            onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              setHoveringZone(zoneId);
            }}
            onMouseOut={() => {
              setHoveringZone('droppable-top');
            }}
            onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
              // console.log({ target: e.target, e, rect: e.target.getBoundingClientRect() });
              // const rect = e.target.getBoundingClientRect();
              // const x = e.clientX - rect.left; //x position within the element.
              // const y = e.clientY - rect.top; //y position within the element.
              // console.log('Left? : ' + x + ' ; Top? : ' + y + '.');
              // if (showDirectionChooser && userIsDragging) {
              //   const quadrant = getQuadrant(e.nativeEvent, e.currentTarget);
              //   const isHorizontal = quadrant === 2 || quadrant === 3;
              //   console.log({ isHorizontal, quadrant, showDirectionChooser });
              // }
              // setDirection(quadrant === 2 || quadrant === 3 ? 'horizontal' : 'vertical');
            }}>
            Top {provided.placeholder}
          </WrapperComponent>
        )}
      </Droppable>
      <div>{elementToRender}</div>
    </>
  );
};

export default InferDirection;
