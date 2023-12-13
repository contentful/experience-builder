import { VisualEditorMode } from '@contentful/experience-builder-types';

export let visualEditorMode = VisualEditorMode.LazyLoad;

/**
 * Configure visual editor mode (lazy load or inject script)
 * @param mode VisualEditorMode
 * @returns void
 */
export const setVisualEditorMode = (mode: VisualEditorMode) => {
  visualEditorMode = mode;
};
