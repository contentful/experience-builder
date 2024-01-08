import { useEffect, useRef } from 'react';

import { MouseMoveHandler } from '../communication/MouseMoveHandler';
import { MouseOverHandler } from '../communication/MouseOverHandler';

export const useHoverIndicator = (isDragging: boolean): void => {
  const mouseMoveIndicator = useRef<MouseMoveHandler>(new MouseMoveHandler());
  const mouseOverHandler = useRef<MouseOverHandler>(new MouseOverHandler());

  useEffect(() => {
    const current = mouseOverHandler.current;
    current.attachEvent();
    return () => {
      current.detachEvent();
    };
  }, []);

  useEffect(() => {
    const current = mouseMoveIndicator.current;
    if (isDragging) {
      current.attachEvent();
    }

    return () => {
      current.detachEvent();
    };
  }, [isDragging]);
};
