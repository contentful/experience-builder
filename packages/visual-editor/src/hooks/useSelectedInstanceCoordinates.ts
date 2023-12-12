import { useEffect } from 'react';
import { CompositionComponentNode } from '@contentful/experience-builder-core';
import { sendSelectedComponentCoordinates } from '@/communication/sendSelectedComponentCoordinates';
import { useEditorStore } from '@/store/editor';
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
  }, [node]);
};
