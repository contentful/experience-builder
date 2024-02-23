import { CONTENTFUL_COMPONENTS } from '@contentful/experience-builder-core/constants';

export const DRAGGABLE_HEIGHT = 40;
export const DRAGGABLE_WIDTH = 50;

export const ROOT_ID = 'root';
export const COMPONENT_LIST_ID = 'component-list';
export const CTFL_ZONE_ID = 'data-ctfl-zone-id';

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
