import { useEffect } from 'react';
import type { ExperienceTreeNode } from '@contentful/experiences-core/types';
import { useEditorStore } from '@/store/editor';
import { getElementCoordinates } from '@contentful/experiences-core';
import { sendSelectedComponentCoordinates } from '@/communication/sendSelectedComponentCoordinates';
/**
 * This hook gets the element co-ordinates of a specified element in the DOM
 * and sends the DOM Rect to the client app
 */
export const useSelectedInstanceCoordinates = ({ node }: { node: ExperienceTreeNode }) => {
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);

  useEffect(() => {
    if (selectedNodeId !== node.data.id) {
      return;
    }

    // Allows the drop animation to finish before
    // calculating the components coordinates
    setTimeout(() => {
      sendSelectedComponentCoordinates(node.data.id);
    }, 10);
  }, [node, selectedNodeId]);

  const selectedElement = node.data.id
    ? document.querySelector(`[data-cf-node-id="${selectedNodeId}"]`)
    : undefined;
  return selectedElement ? getElementCoordinates(selectedElement) : null;
};
