import { useEffect, useRef } from 'react';

import { MouseMoveHandler } from '../communication/MouseMoveHandler';
import { MouseOverHandler } from '../communication/MouseOverHandler';

export const useHoverIndicator = (isDragging: boolean): void => {
  const mouseMoveIndicator = useRef<MouseMoveHandler>(new MouseMoveHandler());
  const mouseOverHandler = useRef<MouseOverHandler>(new MouseOverHandler());

  useEffect(() => {
    mouseOverHandler.current.attachEvent();

    return () => {
      mouseOverHandler.current.detachEvent();
    };
  }, []);

  useEffect(() => {
    if (isDragging) {
      mouseMoveIndicator.current.attachEvent();
    }

    return () => {
      mouseMoveIndicator.current.detachEvent();
    };
  }, [isDragging]);
};
