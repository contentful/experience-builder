import { CompositionComponentNode } from '../types';
import { OUTGOING_EVENTS, sendMessage } from '@contentful/experience-builder-core';

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
