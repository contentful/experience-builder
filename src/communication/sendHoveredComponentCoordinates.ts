import { getElementCoordinates } from '../core/domValues'
import { sendMessage } from '../sendMessage'
import { OutgoingExperienceBuilderEvent } from '../types'

/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app
 */
export const sendHoveredComponentCoordinates = (instanceId?: string) => {
  const selectedElement = instanceId
    ? document.querySelector(`[data-cf-node-id="${instanceId}"]`)
    : undefined

  // Finds the first parent that is a VisualEditorBlock
  let parent = selectedElement?.parentElement
  while (parent) {
    if (parent?.dataset?.cfNodeId) {
      break
    }
    parent = parent?.parentElement
  }

  if (selectedElement) {
    sendMessage(OutgoingExperienceBuilderEvent.UPDATE_HOVERED_COMPONENT_COORDINATES, {
      hoveredNodeCoordinates: getElementCoordinates(selectedElement),
      parentCoordinates: parent ? getElementCoordinates(parent) : null,
    })
  }
}
