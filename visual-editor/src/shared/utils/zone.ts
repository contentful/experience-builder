import { ROOT_ID } from './constants';

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
