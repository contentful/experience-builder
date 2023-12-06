import { OUTGOING_EVENTS } from '@contentful/experience-builder-core';
import { getElementCoordinates } from '../shared/utils/domValues';
import { sendMessage } from './sendMessage';

/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app
 */
export const sendSelectedComponentCoordinates = (instanceId?: string) => {
  const selectedElement = instanceId
    ? document.querySelector(`[data-cf-node-id="${instanceId}"]`)
    : undefined;

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
      parentCoordinates: parent ? getElementCoordinates(parent) : null,
    });
  }
};
