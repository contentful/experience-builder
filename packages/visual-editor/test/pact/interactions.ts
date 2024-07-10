import {
  AssembliesAddedPayload,
  AssembliesRegisteredPayload,
  CanvasResizedPayload,
  ComponentDraggingChangedPayload,
  ExperienceUpdatedPayload,
  HoverComponentPayload,
  MouseMovePayload,
  RequestedEntitiesPayload,
  SelectComponentPayload,
  UpdatedEntityPayload,
  IncomingComponentMoveEndedPayload,
} from '@contentful/experiences-core/types';
import { INCOMING_EVENTS } from '@contentful/experiences-core/constants';
import { Matchers as m, MatchersV3 as mV3 } from '@pact-foundation/pact';
import { entries } from '../__fixtures__/entities';
import { assemblyDefinition } from '../__fixtures__/assemblyDefinition';
import { createAssemblyEntry } from '../__fixtures__/assembly';
import { tree } from '../__fixtures__/tree';

const SOURCE = 'composability-app';

export const InteractionIds = {
  experienceTreeUpdatedInteractionId: 'component-tree-updated-event',
  experienceNodeUpdatedInteractionId: 'component-tree-node-updated-event',
  componentDraggingChangedInteractionId: 'component-dragging-changed-event',
  componentMoveEndedInteractionId: 'component-move-ended-event',
  canvasResizedInteractionId: 'canvas-resized-event',
  selectComponentInteractionId: 'select-component-event',
  hoverComponentInteractionId: 'hover-component-event',
  updatedEntityInteractionId: 'updated-entity-event',
  assembliesAddedInteractionId: 'assemblies-added-event',
  assembliesRegisteredInteractionId: 'assemblies-registered-event',
  mouseMoveInteractionId: 'mouse-move-event',
  requestedEntitiesInteractionId: 'requested-entities-event',
};

const treeNodeMatcher = {
  children: m.eachLike({}),
  type: m.string(),
  data: m.like({
    breakpoints: m.eachLike({
      id: m.string(),
      displayName: m.string(),
      query: m.string(),
      previewSize: m.string(),
      displayIcon: m.string(),
    }),
    dataSource: mV3.eachValueMatches(
      { uuid1: { sys: { id: m.string(), linkType: m.like('Entry'), type: 'Link' } } },
      mV3.like({ sys: { id: m.string(), linkType: m.like('Entry'), type: 'Link' } }),
    ),
    id: m.string(),
    props: m.like({}),
    unboundValues: mV3.eachValueMatches(
      { uuid1: { value: m.string() } },
      mV3.like({ value: m.string() }),
    ),
    blockId: m.string(),
  }),
};

const treeMatcher = {
  root: treeNodeMatcher,
};
const experienceTreeUpdatedInteraction = {
  id: InteractionIds.experienceTreeUpdatedInteractionId,
  description: `a ${INCOMING_EVENTS.ExperienceUpdated} event is sent by the Web App`,
  event: INCOMING_EVENTS.ExperienceUpdated,
  payload: {
    eventType: INCOMING_EVENTS.ExperienceUpdated,
    source: SOURCE,
    payload: {
      tree,
      locale: 'en-US',
    } as ExperienceUpdatedPayload,
  },
  payloadMatcher: {
    eventType: INCOMING_EVENTS.ExperienceUpdated,
    source: SOURCE,
    payload: {
      eventType: INCOMING_EVENTS.ExperienceUpdated,
      source: SOURCE,
      payload: {
        tree: treeMatcher,
        locale: m.string(),
      },
    },
  },
};

const experienceNodeUpdatedInteraction = {
  id: InteractionIds.experienceNodeUpdatedInteractionId,
  description: `a ${INCOMING_EVENTS.ExperienceUpdated} event for a single node is sent by the Web App`,
  event: INCOMING_EVENTS.ExperienceUpdated,
  payload: {
    eventType: INCOMING_EVENTS.ExperienceUpdated,
    source: SOURCE,
    payload: {
      tree,
      changedNode: tree.root.children[0],
      changedValueType: 'UnboundValue',
      locale: 'en-US',
    } as ExperienceUpdatedPayload,
  },
  payloadMatcher: {
    eventType: INCOMING_EVENTS.ExperienceUpdated,
    source: SOURCE,
    payload: {
      tree: treeMatcher,
      changedNode: treeNodeMatcher,
      changedValueType: m.term({
        generate: 'UnboundValue',
        matcher: 'UnboundValue|BoundValue',
      }),
      locale: m.string(),
    },
  },
};

const componentDraggingChangedInteraction = {
  id: InteractionIds.componentDraggingChangedInteractionId,
  description: `a ${INCOMING_EVENTS.ComponentDraggingChanged} event is sent by the Web App`,
  event: INCOMING_EVENTS.ComponentDraggingChanged,
  payload: {
    eventType: INCOMING_EVENTS.ComponentDraggingChanged,
    source: SOURCE,
    payload: { isDragging: false } as ComponentDraggingChangedPayload,
  },
  payloadMatcher: {
    eventType: INCOMING_EVENTS.ComponentDraggingChanged,
    source: SOURCE,
    payload: {
      isDragging: m.like(false),
    },
  },
};

const componentMoveEndedInteraction = {
  id: InteractionIds.componentMoveEndedInteractionId,
  description: `a ${INCOMING_EVENTS.ComponentMoveEnded} event is sent by the Web App`,
  event: INCOMING_EVENTS.ComponentMoveEnded,
  payload: {
    eventType: INCOMING_EVENTS.ComponentMoveEnded,
    source: SOURCE,
    payload: {
      mouseX: 100,
      mouseY: 100,
    } as IncomingComponentMoveEndedPayload,
  },
  payloadMatcher: {
    eventType: INCOMING_EVENTS.ComponentMoveEnded,
    source: SOURCE,
    payload: {
      mouseX: m.like(100),
      mouseY: m.like(100),
    },
  },
};

const canvasResizedInteraction = {
  id: InteractionIds.canvasResizedInteractionId,
  description: `a ${INCOMING_EVENTS.CanvasResized} event is sent by the Web App`,
  event: INCOMING_EVENTS.CanvasResized,
  payload: {
    eventType: INCOMING_EVENTS.CanvasResized,
    source: SOURCE,
    payload: { selectedNodeId: 'node-id' } as CanvasResizedPayload,
  },
  payloadMatcher: {
    eventType: INCOMING_EVENTS.CanvasResized,
    source: SOURCE,
    payload: { selectedNodeId: m.like('node-id') },
  },
};

const selectComponentInteraction = {
  id: InteractionIds.selectComponentInteractionId,
  description: `a ${INCOMING_EVENTS.SelectComponent} event is sent by the Web App`,
  event: INCOMING_EVENTS.SelectComponent,
  payload: {
    eventType: INCOMING_EVENTS.SelectComponent,
    source: SOURCE,
    payload: { selectedNodeId: 'node-id' } as SelectComponentPayload,
  },
  payloadMatcher: {
    eventType: INCOMING_EVENTS.SelectComponent,
    source: SOURCE,
    payload: { selectedNodeId: m.like('node-id') },
  },
};

const hoverComponentInteraction = {
  id: InteractionIds.hoverComponentInteractionId,
  description: `a ${INCOMING_EVENTS.HoverComponent} event is sent by the Web App`,
  event: INCOMING_EVENTS.HoverComponent,
  payload: {
    eventType: INCOMING_EVENTS.HoverComponent,
    source: SOURCE,
    payload: { hoveredNodeId: 'node-id' } as HoverComponentPayload,
  },
  payloadMatcher: {
    eventType: INCOMING_EVENTS.HoverComponent,
    source: SOURCE,
    payload: { hoveredNodeId: m.like('node-id') },
  },
};

const entity = entries[0];
const updatedEntity = {
  ...entity,
  sys: { ...entity.sys, version: entity.sys.version + 1 },
};
const entityMatcher = {
  sys: m.like({
    id: m.string(),
    type: m.string(),
    version: m.integer(),
  }),
  fields: m.like({}),
};
const updatedEntityInteraction = {
  id: InteractionIds.updatedEntityInteractionId,
  description: `a ${INCOMING_EVENTS.UpdatedEntity} event is sent by the Web App`,
  event: INCOMING_EVENTS.UpdatedEntity,
  payload: {
    eventType: INCOMING_EVENTS.UpdatedEntity,
    source: SOURCE,
    payload: {
      entity: updatedEntity,
      shouldRerender: true,
    } as UpdatedEntityPayload,
  },
  payloadMatcher: {
    eventType: INCOMING_EVENTS.UpdatedEntity,
    source: SOURCE,
    payload: {
      entity: entityMatcher,
      shouldRerender: m.boolean(),
    },
  },
};

const assembly = createAssemblyEntry({});
const assembliesAddedInteraction = {
  id: InteractionIds.assembliesAddedInteractionId,
  description: `a ${INCOMING_EVENTS.AssembliesAdded} event is sent by the Web App`,
  event: INCOMING_EVENTS.AssembliesAdded,
  payload: {
    eventType: INCOMING_EVENTS.AssembliesAdded,
    source: SOURCE,
    payload: {
      assembly,
      assemblyDefinition,
    } as AssembliesAddedPayload,
  },
  payloadMatcher: {
    eventType: INCOMING_EVENTS.AssembliesAdded,
    source: SOURCE,
    payload: {
      assembly: {},
      assemblyDefinition: {
        id: m.like('assembly-id'),
        name: m.like('Assembly'),
        variables: m.like({}),
      },
    },
  },
};

const assembliesRegisteredInteraction = {
  id: InteractionIds.assembliesRegisteredInteractionId,
  description: `a ${INCOMING_EVENTS.AssembliesRegistered} event is sent by the Web App`,
  event: INCOMING_EVENTS.AssembliesRegistered,
  payload: {
    eventType: INCOMING_EVENTS.AssembliesRegistered,
    source: SOURCE,
    payload: { assemblies: [assemblyDefinition] } as AssembliesRegisteredPayload,
  },
  payloadMatcher: {
    eventType: INCOMING_EVENTS.AssembliesRegistered,
    source: SOURCE,
    payload: {
      assemblies: m.eachLike({
        id: m.like('assembly-id'),
        name: m.like('Assembly'),
        variables: m.like({}),
      }),
    },
  },
};

const mouseMoveInteraction = {
  id: InteractionIds.mouseMoveInteractionId,
  description: `a ${INCOMING_EVENTS.MouseMove} event is sent by the Web App`,
  event: INCOMING_EVENTS.MouseMove,
  payload: {
    eventType: INCOMING_EVENTS.MouseMove,
    source: SOURCE,
    payload: { clientX: 100, clientY: 100 } as MouseMovePayload,
  },
  payloadMatcher: {
    eventType: INCOMING_EVENTS.MouseMove,
    source: SOURCE,
    payload: { clientX: m.like(100), clientY: m.like(100) },
  },
};

const requestedEntitiesInteraction = {
  id: InteractionIds.requestedEntitiesInteractionId,
  description: `a ${INCOMING_EVENTS.RequestedEntities} event is sent by the Web App`,
  event: INCOMING_EVENTS.RequestedEntities,
  payload: {
    eventType: INCOMING_EVENTS.RequestedEntities,
    source: SOURCE,
    payload: { entities: entries } as RequestedEntitiesPayload,
  },
  payloadMatcher: {
    eventType: INCOMING_EVENTS.RequestedEntities,
    source: SOURCE,
    payload: { entities: m.eachLike(entityMatcher) },
  },
};

export const interactions = [
  experienceTreeUpdatedInteraction,
  experienceNodeUpdatedInteraction,
  componentDraggingChangedInteraction,
  componentMoveEndedInteraction,
  canvasResizedInteraction,
  selectComponentInteraction,
  hoverComponentInteraction,
  updatedEntityInteraction,
  assembliesAddedInteraction,
  assembliesRegisteredInteraction,
  mouseMoveInteraction,
  requestedEntitiesInteraction,
];
