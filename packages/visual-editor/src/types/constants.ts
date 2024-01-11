import {
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SECTION_ID,
} from '@contentful/experience-builder-core/constants';

export const DRAGGABLE_HEIGHT = 74;
export const DRAGGABLE_WIDTH = 92;
export const ROOT_ID = 'root';

export const builtInComponents = [CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID];

export enum TreeAction {
  REMOVE_NODE,
  ADD_NODE,
  MOVE_NODE,
  UPDATE_NODE,
  REORDER_NODE,
  REPLACE_NODE,
}
