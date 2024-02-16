import { sendMessage } from '@contentful/experiences-core';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';

export const onComponentMoved = (options: {
  nodeId: string;
  sourceParentId: string;
  destinationParentId: string;
  sourceIndex: number;
  destinationIndex: number;
}) => {
  sendMessage(OUTGOING_EVENTS.ComponentMoved, options);
};
