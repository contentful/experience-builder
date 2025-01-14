import { sendMessage, getElementCoordinates } from '@contentful/experiences-core';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';

/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app
 */
export const sendSelectedComponentCoordinates = (instanceId?: string) => {
  if (!instanceId) return;
  let selectedElement = document.querySelector<HTMLElement>(`[data-cf-node-id="${instanceId}"]`);
  let selectedAssemblyChild: HTMLElement | null | undefined = undefined;
  let parent: HTMLElement | null | undefined = null;

  // Use RegEx instead of split to match the last occurrence of '---' in the instanceId instead of the first one
  const idMatch = instanceId.match(/(.*)---(.*)/);
  const rootNodeId = idMatch?.[1] ?? instanceId;
  const nodeLocation = idMatch?.[2];
  const isNestedAssembly = nodeLocation && selectedElement?.dataset?.cfNodeBlockType === 'assembly';

  // For nested assemblied, return their selection rectangle and the upper assembly as parent
  if (isNestedAssembly) {
    parent = document.querySelector<HTMLElement>(`[data-cf-node-id="${rootNodeId}"]`);
  } else {
    // For assembly blocks, render the assembly as selected component
    if (nodeLocation) {
      selectedAssemblyChild = selectedElement;
      selectedElement = document.querySelector(`[data-cf-node-id="${rootNodeId}"]`);
    }
    // Find the next parent of the selected element
    parent = selectedElement?.parentElement;
  }

  // Finds the first parent that is a VisualEditorBlock
  while (parent && !parent.dataset?.cfNodeId) {
    parent = parent?.parentElement;
  }

  if (selectedElement) {
    const sendUpdateSelectedComponentCoordinates = () => {
      sendMessage(OUTGOING_EVENTS.UpdateSelectedComponentCoordinates, {
        selectedNodeCoordinates: getElementCoordinates(selectedElement!),
        selectedAssemblyChildCoordinates: selectedAssemblyChild
          ? getElementCoordinates(selectedAssemblyChild)
          : undefined,
        parentCoordinates: parent ? getElementCoordinates(parent) : undefined,
      });
    };

    const childImage = selectedElement.querySelector('img');
    if (childImage) {
      const handleImageLoad = () => {
        sendUpdateSelectedComponentCoordinates();
        childImage.removeEventListener('load', handleImageLoad);
      };
      childImage.addEventListener('load', handleImageLoad);
    }

    sendUpdateSelectedComponentCoordinates();
  }
};
