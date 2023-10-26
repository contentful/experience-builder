import { CompositionComponentNode } from '../types'
import { OUTGOING_EVENTS } from '../constants'
import { sendMessage } from './sendMessage'

export const onComponentDropped = ({
  node,
  index,
}: {
  node: CompositionComponentNode
  index?: number
}) => {
  sendMessage(OUTGOING_EVENTS.ComponentDropped, {
    node,
    index: index ?? node.children.length,
  })
}
