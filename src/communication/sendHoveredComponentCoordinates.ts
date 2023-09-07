import { getElementCoordinates } from '../core/domValues'
import { OutgoingExperienceBuilderEvent } from '../types'
import { sendMessage } from './sendMessage'

/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app
 */
export const sendHoveredComponentCoordinates = (instanceId?: string) => {
  const selectedElement: HTMLElement | null | undefined = instanceId
    ? (document.querySelector(`[data-cf-node-id="${instanceId}"]`) as HTMLElement)
    : undefined

  // Finds the first parent that is a VisualEditorBlock
  let parent = selectedElement?.parentElement
  while (parent) {
    if (parent?.dataset?.cfNodeId) {
      break
    }
    parent = parent?.parentElement
  }

  const componentData = selectedElement?.dataset

  if (selectedElement) {
    sendMessage(OutgoingExperienceBuilderEvent.UPDATE_HOVERED_COMPONENT_COORDINATES, {
      component: componentData
        ? {
            nodeId: componentData.cfNodeId,
            blockId: componentData.cfNodeBlockId,
            blockType: componentData.cfNodeBlockType,
          }
        : null,
      hoveredNodeCoordinates: getElementCoordinates(selectedElement),
      parentCoordinates: parent ? getElementCoordinates(parent) : null,
    })
  }
}
