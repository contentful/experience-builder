import { useEffect } from "react"
import { getElementCoordinates } from "../core/dom-values"
import { CompositionComponentNode, OutgoingExperienceBuilderEvent } from "../types"
import { useCommunication } from "./useCommunication"

/**
 * This hook gets the element co-ordinates of a specified element in the DOM
 * and sends the DOM Rect to the client app
 */
export const useSelectedInstanceCoordinates = ({ instanceId, node }: {
	instanceId?: string,
	node: CompositionComponentNode
}) => {
	const { sendMessage } = useCommunication()
	const selectedElement = instanceId && document.querySelector(`[data-cf-node-id="${instanceId}"]`)

	useEffect(() => {
		if(selectedElement) {
			sendMessage(OutgoingExperienceBuilderEvent.UPDATE_SELECTED_COMPONENT_RECT, {
				selectedNodeCoordinates: getElementCoordinates(selectedElement)
			})
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedElement, node])
}