import { useEffect } from 'react'
import { getElementCoordinates } from '../core/domValues'
import { CompositionComponentNode, OutgoingExperienceBuilderEvent } from '../types'
import { sendMessage } from '../sendMessage'

/**
 * This hook gets the element co-ordinates of a specified element in the DOM
 * and sends the DOM Rect to the client app
 */
export const useSelectedInstanceCoordinates = ({
  instanceId,
  node,
}: {
  instanceId?: string
  node: CompositionComponentNode
}) => {
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

  useEffect(() => {
    if (selectedElement) {
      sendMessage(OutgoingExperienceBuilderEvent.UPDATE_SELECTED_COMPONENT_COORDINATES, {
        selectedNodeCoordinates: getElementCoordinates(selectedElement),
        parentCoordinates: parent ? getElementCoordinates(parent) : null,
      })
    }
    // we need to update on changes on node, that's we add this to the dep array
  }, [selectedElement, node])
}
