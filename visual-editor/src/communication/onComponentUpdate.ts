import { CompositionComponentNode } from '../types';
import { OUTGOING_EVENTS } from '@contentful/experience-builder';
import { sendMessage } from './sendMessage';

export const onComponentUpdate = ({
  node,
  index,
  parentBlockId,
  parentType,
}: {
  node: CompositionComponentNode;
  index?: number;
  parentType?: string;
  parentBlockId?: string;
}) => {
  sendMessage(OUTGOING_EVENTS.ComponentUpdated, {
    node,
    index: index ?? node.children.length,
    parentBlockId,
    parentType,
  });
};
