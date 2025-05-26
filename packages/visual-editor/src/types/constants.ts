import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';

export const ROOT_ID = 'root';
export const COMPONENT_LIST_ID = 'component-list';
export const NEW_COMPONENT_ID = 'ctfl-new-draggable';

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
