import { sendMessage } from '@contentful/experiences-core';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import html2canvas from 'html2canvas';

const dragPreviews = new Map<string, string>();

/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app
 */
export const sendComponentDragPreview = async (instanceId?: string) => {
  if (!instanceId) return;

  const dragPreview = dragPreviews.get(instanceId);

  if (dragPreview) return;

  const selectedElement = document.querySelector(`[data-cf-node-id="${instanceId}"]`);

  if (!selectedElement) return;

  const image = await html2canvas(selectedElement as HTMLElement, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: 'transparent',
  }).then((canvas) => {
    return canvas.toDataURL('image/png');
  });

  dragPreviews.set(instanceId, image);

  sendMessage(OUTGOING_EVENTS.ComponentDragPreview, {
    nodeId: instanceId,
    image,
  });
};
