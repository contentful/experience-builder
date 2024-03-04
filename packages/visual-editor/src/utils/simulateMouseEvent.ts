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

export function simulateMouseEvent(coordX: number, coordY: number, eventName = 'mousemove') {
  const element = document.querySelector('#item');

  if (!dragState.isDragStart) {
    return;
  }

  if (!dragState.isDragging) {
    updateDraggableElement(coordX, coordY);
    eventName = 'mousedown';
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

  const event = new MouseEvent(eventName, options);
  element.dispatchEvent(event);
}

export function simulateComponentMove(
  coordX: number,
  coordY: number,
  selector: string,
  eventName = 'mousemove',
) {
  const element = document.querySelector(selector);

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

  const event = new MouseEvent(eventName, options);
  element.dispatchEvent(event);
}
