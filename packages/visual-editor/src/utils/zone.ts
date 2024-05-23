import { ROOT_ID } from '../types/constants';

export const getZoneParents = (zoneId: string) => {
  const element = document.querySelector(`[data-rfd-droppable-id='${zoneId}']`);

  if (!element) {
    return [];
  }

  function getZonesToRoot(element: Element | null, parentIds: string[] = []) {
    if (!element) {
      return parentIds;
    }

    const attribute = element.getAttribute('data-rfd-droppable-id');

    if (attribute === ROOT_ID) {
      return parentIds;
    }

    if (attribute) {
      parentIds.push(attribute);
    }

    return getZonesToRoot(element.parentElement, parentIds);
  }

  return getZonesToRoot(element);
};

/**
 * Parses a droppable zone ID into a node ID and slot ID.
 *
 * The slot ID is optional and only present if the component implements multiple drop zones.
 *
 * @param zoneId - Expected formats are `nodeId` or `nodeId|slotId`.
 */
export const parseZoneId = (zoneId: string) => {
  const [nodeId, slotId] = zoneId.includes('|') ? zoneId.split('|') : [zoneId, undefined];
  return { nodeId, slotId };
};
