import React, { useEffect, useState } from 'react';
import styles from './InferDirection.module.css';
import classNames from 'classnames';
import { Droppable } from '@hello-pangea/dnd';

interface InferDirectionProps extends React.PropsWithChildren {
  droppableId: string;
  isDragging: boolean;
  className: string | undefined;
  innerRef?: (element?: HTMLElement | null | undefined) => void;
}

const InferDirection: React.FC<InferDirectionProps> = ({
  isDragging,
  droppableId,
  innerRef,
  className,
  // droppableId,
  children,
  // rest,
  // node: rawNode,
  // resolveDesignValue,
  // zoneId,
}) => {
  const [itemStyles, setItemStyles] = useState<React.CSSProperties>({});
  const [position, setPosition] = useState<string>();

  useEffect(() => {
    if (!isDragging) {
      setPosition(undefined);
    }
  }, [isDragging]);

  const handleMouseOver = (e: React.MouseEvent) => {
    console.log('in handle');
    if (isDragging) {
      const currentTarget = e.currentTarget as HTMLElement;
      const queryStr = `[data-ctfl-draggable-id]`;
      const element = currentTarget.querySelector(queryStr);
      if (element) {
        const direction = getMousePosition(e.nativeEvent, element);
        console.log('position in handle', position);
        setPosition(direction);
        // switch (direction) {
        //   case 'left':
        //     setItemStyles({
        //       transform: 'translateX(50px)',
        //     });
        //     break;
        //   case 'right':
        //     setItemStyles({
        //       transform: 'translateX(-50px)',
        //     });
        //     break;
        //   case 'above':
        //     setItemStyles({
        //       transform: 'translateY(30px)',
        //     });
        //     break;
        //   case 'below':
        //     setItemStyles({
        //       transform: 'translateY(-30px)',
        //     });
        //     break;
        //   default:
        //     setItemStyles({
        //       transform: 'unset',
        //     });
        //     break;
        // }
      }
    }
  };

  const handleMouseOut = () => {
    if (isDragging) {
      setItemStyles({});
    }
  };

  // console.log('positiodddddn', position)
  const direction = position === 'left' || position === 'right' ? 'horizontal' : 'vertical';

  // console.log('direction', direction);

  return (
    <div
      className={classNames(styles.inferredDirectionContainer, className)}
      onMouseMove={handleMouseOver}
      onMouseOut={handleMouseOut}
      style={{
        pointerEvents: 'all', //isDragging ? 'all' : undefined,
      }}>
      <Droppable droppableId={droppableId} direction={direction}>
        {(provided, source) => (
          <div
            ref={provided.innerRef}
            className={classNames(styles.flexContainer, styles[position || ''])}
            style={itemStyles}>
            <div className={styles.childContainer}>{children}</div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default InferDirection;

function getMousePosition(event: MouseEvent, element: Element): string {
  const rect = element.getBoundingClientRect();
  let offsetLeft = 0;
  let offsetRight = 0;
  let offsetTop = 0;
  let offsetBottom = 0;
  // Get the container element and use its padding to offset the mouse position
  const cfStylesElement = element.children[1];
  if (cfStylesElement) {
    const computedStyle = window.getComputedStyle(cfStylesElement);
    offsetLeft = parseInt(computedStyle.paddingLeft);
    offsetRight = parseInt(computedStyle.paddingRight);
    offsetTop = parseInt(computedStyle.paddingTop);
    offsetBottom = parseInt(computedStyle.paddingBottom);
  }
  const x = event.clientX;
  const y = event.clientY;

  if (x < rect.left + offsetLeft) {
    return 'left';
  } else if (x > rect.right - offsetRight) {
    return 'right';
  } else {
    if (y < rect.top + offsetTop) {
      return 'above';
    } else if (y > rect.bottom - offsetBottom) {
      return 'below';
    } else {
      return '';
    }
  }
}
