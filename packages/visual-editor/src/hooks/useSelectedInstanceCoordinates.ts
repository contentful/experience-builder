import { useEffect } from 'react';
import type { CompositionComponentNode } from '@contentful/experience-builder-core/types';
import { sendSelectedComponentCoordinates } from '@/communication/sendSelectedComponentCoordinates';
import { useEditorStore } from '@/store/editor';
import { getElementCoordinates } from '@contentful/experience-builder-core';
/**
 * This hook gets the element co-ordinates of a specified element in the DOM
 * and sends the DOM Rect to the client app
 */
export const useSelectedInstanceCoordinates = ({ node }: { node: CompositionComponentNode }) => {
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);

  useEffect(() => {
    if (selectedNodeId !== node.data.id) {
      return;
    }

    sendSelectedComponentCoordinates(node.data.id);
  }, [node, selectedNodeId]);

  const selectedElement = node.data.id
    ? document.querySelector(`[data-cf-node-id="${selectedNodeId}"]`)
    : undefined;
  return selectedElement ? getElementCoordinates(selectedElement) : null,
};
