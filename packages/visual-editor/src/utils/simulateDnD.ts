import { CTFL_DRAGGING_ELEMENT, NEW_COMPONENT_ID } from '../types/constants';
import DragState from './dragState';

class SimulateDnD extends DragState {
  private draggingElement: Element | null;

  constructor() {
    super();
    this.draggingElement = null;
  }

  public setupDrag() {
    this.updateIsDragStartedOnParent(true);
  }

  public startDrag(coordX: number, coordY: number) {
    this.draggingElement = document.getElementById(NEW_COMPONENT_ID);
    this.updateIsDragging(true);
    this.simulateMouseEvent(coordX, coordY, 'mousedown');
  }

  public updateDrag(coordX: number, coordY: number) {
    if (!this.draggingElement) {
      this.draggingElement = document.querySelector(`[${CTFL_DRAGGING_ELEMENT}]`);
    }
    this.simulateMouseEvent(coordX, coordY);
  }

  public endDrag(coordX: number, coordY: number) {
    this.simulateMouseEvent(coordX, coordY, 'mouseup');
    this.reset();
  }

  public reset() {
    this.draggingElement = null;
    this.resetState();
  }

  private simulateMouseEvent(coordX: number, coordY: number, eventName = 'mousemove') {
    const options = {
      bubbles: true,
      cancelable: true,
      view: window,
      pageX: 0,
      pageY: 0,
      clientX: coordX,
      clientY: coordY - window.scrollY,
    };

    if (!this.draggingElement) {
      return;
    }

    const event = new MouseEvent(eventName, options);
    this.draggingElement.dispatchEvent(event);
  }
}

export default new SimulateDnD();
