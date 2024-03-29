import { MouseOverHandler } from './MouseOverHandler';

/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app
 */
export const sendHoveredComponentCoordinates = (instanceId?: string) => {
  const selectedElement: HTMLElement | null | undefined = instanceId
    ? (document.querySelector(`[data-cf-node-id="${instanceId}"]`) as HTMLElement)
    : undefined;

  const mouseOverHandler = new MouseOverHandler();
  mouseOverHandler.handleMouseMove(selectedElement || null);
};
