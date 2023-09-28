import { useEffect } from 'react'
import { CompositionComponentNode } from '../types'
import { sendSelectedComponentCoordinates } from '../communication/sendSelectedComponentCoordinates'
import { useEditorContext } from '../blocks/useEditorContext'

/**
 * This hook gets the element co-ordinates of a specified element in the DOM
 * and sends the DOM Rect to the client app
 */
export const useSelectedInstanceCoordinates = ({ node }: { node: CompositionComponentNode }) => {
  const { selectedNodeId } = useEditorContext()

  useEffect(() => {
    if (selectedNodeId !== node.data.id) {
      return
    }

    sendSelectedComponentCoordinates(node.data.id)
  }, [node, selectedNodeId])
}
