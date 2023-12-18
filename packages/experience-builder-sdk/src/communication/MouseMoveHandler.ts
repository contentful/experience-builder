import { sendMessage } from '@contentful/experience-builder-core';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';

export class MouseMoveHandler {
  onMouseMove = (event: MouseEvent) => {
    const [x, y] = [event.clientX, event.clientY];
    sendMessage(OUTGOING_EVENTS.MouseMove, {
      clientX: x,
      clientY: y,
    });
  };

  attachEvent(): void {
    document.addEventListener('mousemove', this.onMouseMove);
  }

  detachEvent(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}
