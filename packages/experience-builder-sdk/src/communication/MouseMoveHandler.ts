import { OutgoingExperienceBuilderEvent } from '../types'
import { sendMessage } from './sendMessage'

export class MouseMoveHandler {
  onMouseMove = (event: MouseEvent) => {
    const [x, y] = [event.clientX, event.clientY]
    sendMessage(OutgoingExperienceBuilderEvent.MOUSE_MOVE, {
      clientX: x,
      clientY: y,
    })
  }

  attachEvent(): void {
    document.addEventListener('mousemove', this.onMouseMove)
  }

  detachEvent(): void {
    document.removeEventListener('mousemove', this.onMouseMove)
  }
}
