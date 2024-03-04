import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';

export const DRAGGABLE_HEIGHT = 30;
export const DRAGGABLE_WIDTH = 50;
export const DRAG_PADDING = 4;

export const ROOT_ID = 'root';
export const COMPONENT_LIST_ID = 'component-list';
export const CTFL_ZONE_ID = 'data-ctfl-zone-id';
export const CTFL_DRAGGABLE_ID = 'data-ctfl-draggable-id';

export const HITBOX = {
  WIDTH: 80,
  HEIGHT: 20,
  INITIAL_OFFSET: 10,
  OFFSET_INCREMENT: 8,
  MIN_HEIGHT: 45,
  MIN_DEPTH_HEIGHT: 20,
  DEEP_ZONE: 5,
};

export const builtInComponents = [
  CONTENTFUL_COMPONENTS.container.id,
  CONTENTFUL_COMPONENTS.section.id,
  CONTENTFUL_COMPONENTS.columns.id,
  CONTENTFUL_COMPONENTS.singleColumn.id,
];

export enum TreeAction {
  REMOVE_NODE,
  ADD_NODE,
  MOVE_NODE,
  UPDATE_NODE,
  REORDER_NODE,
  REPLACE_NODE,
}

export enum HitboxDirection {
  TOP,
  LEFT,
  RIGHT,
  BOTTOM,
  SELF_VERTICAL,
  SELF_HORIZONTAL,
}
