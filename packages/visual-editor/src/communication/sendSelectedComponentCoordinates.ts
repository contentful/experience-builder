import { sendMessage, getElementCoordinates } from '@contentful/experience-builder-core';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';

/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app
 */
export const sendSelectedComponentCoordinates = (instanceId?: string) => {
  if (!instanceId) return;
  let selectedElement = document.querySelector(`[data-cf-node-id="${instanceId}"]`);

  let selectedAssemblyChild: Element | null | undefined = undefined;

  const [rootNodeId, nodeLocation] = instanceId.split('---');

  if (nodeLocation) {
    selectedAssemblyChild = selectedElement;
    selectedElement = document.querySelector(`[data-cf-node-id="${rootNodeId}"]`);
  }

  // Finds the first parent that is a VisualEditorBlock
  let parent = selectedElement?.parentElement;
  while (parent) {
    if (parent?.dataset?.cfNodeId) {
      break;
    }
    parent = parent?.parentElement;
  }

  if (selectedElement) {
    sendMessage(OUTGOING_EVENTS.UpdateSelectedComponentCoordinates, {
      selectedNodeCoordinates: getElementCoordinates(selectedElement),
      selectedAssemblyChildCoordinates: selectedAssemblyChild
        ? getElementCoordinates(selectedAssemblyChild)
        : null,
      parentCoordinates: parent ? getElementCoordinates(parent) : null,
    });
  }
};
