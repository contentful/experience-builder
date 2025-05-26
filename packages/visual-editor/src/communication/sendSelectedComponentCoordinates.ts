import { sendMessage, getElementCoordinates } from '@contentful/experiences-core';
import { ASSEMBLY_NODE_TYPE, OUTGOING_EVENTS } from '@contentful/experiences-core/constants';

/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app
 */
export const sendSelectedComponentCoordinates = (instanceId?: string) => {
  const selection = getSelectionNodes(instanceId);
  console.log('TK instanceId', instanceId, selection);

  if (selection?.target) {
    const sendUpdateSelectedComponentCoordinates = () => {
      sendMessage(OUTGOING_EVENTS.UpdateSelectedComponentCoordinates, {
        selectedNodeCoordinates: getElementCoordinates(selection.target!),
        selectedAssemblyChildCoordinates: selection.patternChild
          ? getElementCoordinates(selection.patternChild)
          : undefined,
        parentCoordinates: selection.parent ? getElementCoordinates(selection.parent) : undefined,
      });
    };

    // If the target contains an image, wait for this image to be loaded before sending the coordinates
    const childImage = selection.target.querySelector('img');
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

export const getSelectionNodes = (instanceId?: string) => {
  if (!instanceId) return;
  let selectedNode = document.querySelector<HTMLElement>(`[data-cf-node-id="${instanceId}"]`);
  let selectedPatternChild: HTMLElement | null = null;
  let selectedParent: HTMLElement | null = null;

  // Use RegEx instead of split to match the last occurrence of '---' in the instanceId instead of the first one
  const idMatch = instanceId.match(/(.*)---(.*)/);
  const rootNodeId = idMatch?.[1] ?? instanceId;
  const nodeLocation = idMatch?.[2];
  const isNestedPattern =
    nodeLocation && selectedNode?.dataset?.cfNodeBlockType === ASSEMBLY_NODE_TYPE;
  const isPatternChild = !isNestedPattern && nodeLocation;

  if (isPatternChild) {
    // For pattern child nodes, render the pattern itself as selected component
    selectedPatternChild = selectedNode;
    selectedNode = document.querySelector(`[data-cf-node-id="${rootNodeId}"]`);
  } else if (isNestedPattern) {
    // For nested patterns, return the upper pattern as parent
    selectedParent = document.querySelector<HTMLElement>(`[data-cf-node-id="${rootNodeId}"]`);
  } else {
    // Find the next valid parent of the selected element
    selectedParent = selectedNode?.parentElement ?? null;
    // Ensure that the selection parent is a VisualEditorBlock
    while (selectedParent && !selectedParent.dataset?.cfNodeId) {
      selectedParent = selectedParent?.parentElement;
    }
  }

  return { target: selectedNode, patternChild: selectedPatternChild, parent: selectedParent };
};
