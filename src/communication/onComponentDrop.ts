import { CompositionComponentNode, OutgoingExperienceBuilderEvent } from '../types'
import { sendMessage } from './sendMessage'

export const onComponentDropped = ({
  node,
  index,
}: {
  node: CompositionComponentNode
  index?: number
}) => {
  sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_DROPPED, {
    node,
    index: index ?? node.children.length,
  })
}
