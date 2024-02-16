import { sendMessage } from '@contentful/experiences-core';
import { CompositionComponentNode } from '@contentful/experiences-core/types';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';

export const onComponentDropped = ({
  node,
  index,
  parentBlockId,
  parentType,
  parentId,
}: {
  node: CompositionComponentNode;
  index?: number;
  parentType?: string;
  parentBlockId?: string;
  parentId?: string;
}) => {
  sendMessage(OUTGOING_EVENTS.ComponentDropped, {
    node,
    index: index ?? node.children.length,
    parentNode: {
      type: parentType,
      data: {
        blockId: parentBlockId,
        id: parentId,
      },
    },
  });
};
