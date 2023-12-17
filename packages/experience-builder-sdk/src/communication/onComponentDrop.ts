import type { CompositionComponentNode } from '@contentful/experience-builder-core/types';
import { sendMessage } from '@contentful/experience-builder-core';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';

export const onComponentDropped = ({
  node,
  index,
}: {
  node: CompositionComponentNode;
  index?: number;
}) => {
  sendMessage(OUTGOING_EVENTS.ComponentDropped, {
    node,
    index: index ?? node.children.length,
  });
};
