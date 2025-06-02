import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo } from 'react';
import { sendCanvasGeometryUpdatedMessage } from './sendCanvasGeometryUpdatedMessage';
import {
  CanvasGeometryUpdateSourceEvent,
  ExperienceTree,
} from '@contentful/experiences-core/types';

/*
 * Scenarios to consider:
 * - Initialization, especially with delayed resolution of patterns or entries.
 * - Resize the browser window or selecting another breakpoint preview
 * - Updating the tree when changing design/ content of the experience
 * - Refetching entries/ patterns that have been updated in another tab
 * - Delayed rendering of a large image
 * - Unbinding an image and rendering again the placeholder image (fires no mutation event)
 * - Zoom in/out (via pinch, keyboard, browser extension)
 *
 *
 * TODO: We don't consider scrolling and block pointer-events. However, this could happened
 * through keyboard, browser extensions, or custom components. We should listen to this
 * event and undo the scrolling.
 */

export const useCanvasGeometryUpdates = (tree: ExperienceTree) => {
  const debouncedUpdateGeometry = useMemo(
    () =>
      debounce(
        (tree: ExperienceTree, sourceEvent?: CanvasGeometryUpdateSourceEvent) => {
          // When the DOM changed, we still need to wait for the next frame to ensure that
          // rendering is complete (e.g. this is required when deleting a node).
          window.requestAnimationFrame(() => {
            sendCanvasGeometryUpdatedMessage(tree, sourceEvent);
          });
        },
        100,
        {
          leading: true,
        },
      ),
    [],
  );

  useEffect(() => {
    const resizeEventListener = () => debouncedUpdateGeometry(tree, 'resize');
    window.addEventListener('resize', resizeEventListener);

    // In some cases like duplication of a node, this fires two mutation events which both are
    // required. The final coordinates might be available at the first or the second invocation.
    const observer = new MutationObserver(() => debouncedUpdateGeometry(tree, 'mutation'));
    observer.observe(window.document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      window.removeEventListener('resize', resizeEventListener);
      observer.disconnect();
    };
  }, [debouncedUpdateGeometry, tree]);

  // Allows manually firing the update for scenarios that don't trigger a mutation event,
  // such as when unbinding an image source and falling back to a placeholder image.
  const manuallyFireCanvasGeometryUpdate = useCallback(
    (tree: ExperienceTree) => debouncedUpdateGeometry(tree),
    [debouncedUpdateGeometry],
  );

  return { manuallyFireCanvasGeometryUpdate };
};
