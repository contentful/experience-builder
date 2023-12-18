import { DRAGGABLE_HEIGHT, DRAGGABLE_WIDTH } from '../types/constants';
import dragState from './dragState';

function updateDraggableElement(x: number, y: number) {
  const container = document.querySelector('#component-list') as HTMLDivElement;

  if (!container) {
    return;
  }

  container.style.setProperty('top', `${y}px`);
  container.style.setProperty('left', `${x}px`);
}

export function simulateMouseEvent(coordX: number, coordY: number) {
  const element = document.querySelector('#item');

  if (!dragState.isDragStart) {
    return;
  }

  let name = 'mousemove';

  if (!dragState.isDragging) {
    updateDraggableElement(coordX, coordY);

    name = 'mousedown';
    dragState.updateIsDragging(true);
  }

  const options = {
    bubbles: true,
    cancelable: true,
    view: window,
    pageX: 0,
    pageY: 0,
    clientX: coordX - DRAGGABLE_WIDTH / 2,
    clientY: coordY - DRAGGABLE_HEIGHT / 2 - window.scrollY,
  };

  if (!element) {
    return;
  }

  const event = new MouseEvent(name, options);
  element.dispatchEvent(event);
}
