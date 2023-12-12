import {
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SECTION_ID,
} from '@contentful/experience-builder-core';
import { ContentfulContainer } from '@contentful/experience-builder-components';

export const DRAGGABLE_HEIGHT = 74;
export const DRAGGABLE_WIDTH = 92;
export const ROOT_ID = 'root';

export const builtInComponents = {
  [CONTENTFUL_CONTAINER_ID]: ContentfulContainer,
  [CONTENTFUL_SECTION_ID]: ContentfulContainer,
};
