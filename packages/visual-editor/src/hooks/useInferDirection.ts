import { useInferredDirectionStore } from '@/store/inferedDirection';
import React, { useCallback } from 'react';

export function useInferDirection() {
  const [itemStyles, setItemStyles] = useInferredDirectionStore((state) => [
    state.itemStyles,
    state.setItemStyles,
  ]);

  const onMouseMoveHandler = useCallback((e: React.MouseEvent) => {
    const currentTarget = e.currentTarget as HTMLElement;
    const queryStr = `[data-ctfl-draggable-id]`;
    const element = currentTarget.querySelector(queryStr);
    if (element) {
      const direction = getMousePosition(e.nativeEvent, element);

      switch (direction) {
        case 'left':
          setItemStyles({
            transform: 'translateX(5%)',
          });
          break;
        case 'right':
          setItemStyles({
            transform: 'translateX(-5%)',
          });
          break;
        case 'above':
          setItemStyles({
            transform: 'translateY(5%)',
          });
          break;
        case 'below':
          setItemStyles({
            transform: 'translateY(-5%)',
          });
          break;

        // case 'center':
        // default:
        //   setItemStyles({
        //     transform: 'unset',
        //   });
        //   break;
      }
    }

    // if (direction === 'left' || direction === 'right') {
    //   setSingleChildDirection('horizontal');
    // } else {
    //   setSingleChildDirection('vertical');
    // }
    // console.log(
    //   'direction',
    //   direction === 'left' || direction === 'right' ? 'horizontal' : 'vertical'
    // );
    // console.log(e.currentTarget.style.flexDirection);
  }, []);

  return { onMouseMoveHandler, itemStyles };
}

function getMousePosition(event: MouseEvent, element: Element): string {
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
