import { OUTGOING_EVENTS } from '../constants';
import { sendMessage } from './sendMessage';

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
