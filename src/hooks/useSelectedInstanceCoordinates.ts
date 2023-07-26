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
  useEffect(() => {
    const selectedElement =
      instanceId && document.querySelector(`[data-cf-node-id="${instanceId}"]`)
    if (selectedElement) {
      sendMessage(OutgoingExperienceBuilderEvent.UPDATE_SELECTED_COMPONENT_COORDINATES, {
        selectedNodeCoordinates: getElementCoordinates(selectedElement),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, instanceId])
}
