import { sendMessage, getElementCoordinates } from '@contentful/experience-builder-core';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';

/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app
 */
export const sendSelectedComponentCoordinates = (instanceId?: string, assemblyChildId?: string) => {
  const selectedElement = instanceId
    ? document.querySelector(`[data-cf-node-id="${instanceId}"]`)
    : undefined;

  const selectedAssemblyChild = assemblyChildId
    ? document.querySelector(`[data-cf-assembly-block-id="${assemblyChildId}"]`)
    : undefined;

  if (selectedAssemblyChild) {
    console.log(getElementCoordinates(selectedAssemblyChild), 'before');
    // setTimeout(() => {
    console.log(getElementCoordinates(selectedAssemblyChild), 'after', 'L O L');
    // }, 200);
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
