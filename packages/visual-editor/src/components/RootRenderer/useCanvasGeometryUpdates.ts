import { debounce } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { sendCanvasGeometryUpdatedMessage } from './sendCanvasGeometryUpdatedMessage';
import {
  CanvasGeometryUpdateSourceEvent,
  ExperienceTree,
} from '@contentful/experiences-core/types';
import { sendMessage } from '@contentful/experiences-core';
import { OUTGOING_EVENTS, StudioCanvasMode } from '@contentful/experiences-core/constants';

/*
 * Scenarios to consider:
 * - Initialization, especially with delayed resolution of patterns/entries.
 * - Resize the browser window or selecting another breakpoint preview
 * - Updating the tree when changing design/content of the experience
 * - Refetching entries/ patterns that have been updated in another tab
 * - Delayed rendering of a large image
 * - Zoom in/out (via pinch, keyboard, browser extension)
 *
 * TODO: We don't consider scrolling and block pointer-events. However, this could happened
 * through keyboard, browser extensions, or custom components. We should listen to this
 * event and undo the scrolling.
 */
type UseCanvasGeometryUpdatesParams = {
  tree: ExperienceTree;
  canvasMode?: StudioCanvasMode;
};
export const useCanvasGeometryUpdates = ({ tree, canvasMode }: UseCanvasGeometryUpdatesParams) => {
  const debouncedUpdateGeometry = useMemo(
    () =>
      debounce(
        (tree: ExperienceTree, sourceEvent: CanvasGeometryUpdateSourceEvent) => {
          // When the DOM changed, we still need to wait for the next frame to ensure that
          // rendering is complete (e.g. this is required when deleting a node).
          window.requestAnimationFrame(() => {
            sendCanvasGeometryUpdatedMessage(tree, sourceEvent);
          });
        },
        100,
        {
          leading: true,
          // To be sure, we recalculate it at the end of the frame again. Though, we couldn't
          // yet show the need for this. So we might be able to drop this later to boost performance.
          trailing: true,
        },
      ),
    [],
  );

  // Handling image or video resizing separately,
  // as they can load at a different time, some might be hidden or lazy loaded
  // resulting in a layout shift.
  //
  // We observe every media element for resizing using the same ResizeObserver instance.
  // It's safe to call .observe() multiple times on the same element.
  // Also don't need to unobserve removed elements, as they should be garbage collected.
  const [mediaResizeObserver] = useState(() => {
    return new ResizeObserver(() => {
      debouncedUpdateGeometry(treeRef.current, 'mediaResize');
    });
  });
  const debouncedObserveMediaResizing = useMemo(
    () =>
      debounce(
        () => {
          const allMedia = findAllMedia();

          for (const media of allMedia) {
            mediaResizeObserver.observe(media);
          }
        },
        300,
        { trailing: true },
      ),
    [mediaResizeObserver],
  );

  // Store tree in a ref to avoid the need to deactivate & reactivate the mutation observer
  // when the tree changes. This is important to avoid missing out on some mutation events.
  const treeRef = useRef<ExperienceTree>(tree);
  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  // Handling window resize events
  useEffect(() => {
    const resizeEventListener = () => {
      debouncedUpdateGeometry(treeRef.current, 'resize');
    };
    window.addEventListener('resize', resizeEventListener);
    return () => window.removeEventListener('resize', resizeEventListener);
  }, [debouncedUpdateGeometry]);

  // Handling DOM mutations
  useEffect(() => {
    const observer = new MutationObserver(() => {
      debouncedUpdateGeometry(treeRef.current, 'mutation');
      // start observing all media on any DOM change, as there can be newly added elements
      debouncedObserveMediaResizing();
    });
    // send initial geometry in case the tree is empty
    debouncedUpdateGeometry(treeRef.current, 'mutation');
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    return () => observer.disconnect();
  }, [debouncedObserveMediaResizing, debouncedUpdateGeometry]);

  // Delegate scrolling to the canvas
  useEffect(() => {
    if (canvasMode !== StudioCanvasMode.EDITOR) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      sendMessage(OUTGOING_EVENTS.CanvasPan, {
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        clientX: e.clientX,
        clientY: e.clientY,
        deltaX: e.deltaX,
        deltaY: e.deltaY,
      });
    };
    document.addEventListener('wheel', onWheel, { passive: false });
    return () => document.removeEventListener('wheel', onWheel);
  }, [canvasMode]);
};

function findAllMedia() {
  return Array.from(document.querySelectorAll('img, video'));
}
