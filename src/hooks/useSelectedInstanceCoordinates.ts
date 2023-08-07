import { useEffect } from 'react'
import { CompositionComponentNode } from '../types'
import { sendSelectedComponentCoordinates } from '../communication/sendSelectedComponentCoordinates'

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
    if (instanceId !== node.data.id) {
      return
    }

    sendSelectedComponentCoordinates(instanceId);
    // we need to update on changes on node, that's we add this to the dep array
  }, [instanceId, node])
}
