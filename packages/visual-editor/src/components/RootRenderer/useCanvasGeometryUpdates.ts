import { debounce } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  waitForImageToBeLoaded,
  sendCanvasGeometryUpdatedMessage,
} from './sendCanvasGeometryUpdatedMessage';
import {
  CanvasGeometryUpdateSourceEvent,
  ExperienceTree,
} from '@contentful/experiences-core/types';

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
};
export const useCanvasGeometryUpdates = ({ tree }: UseCanvasGeometryUpdatesParams) => {
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

  const debouncedCollectImages = useMemo(
    () =>
      debounce(
        () => {
          return Array.from(document.querySelectorAll('img'));
        },
        300,
        { leading: true, trailing: true },
      ),
    [],
  );

  // Store tree in a ref to avoid the need to deactivate & reactivate the mutation observer
  // when the tree changes. This is important to avoid missing out on some mutation events.
  const treeRef = useRef<ExperienceTree>(tree);
  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  // Handling window resize events
  useEffect(() => {
    const resizeEventListener = () => debouncedUpdateGeometry(treeRef.current, 'resize');
    window.addEventListener('resize', resizeEventListener);
    return () => window.removeEventListener('resize', resizeEventListener);
  }, [debouncedUpdateGeometry]);

  const [{ allImages, loadedImages }, setImages] = useState(() => {
    const allImages = debouncedCollectImages();
    const loadedImages = new WeakSet<HTMLImageElement>();
    return { allImages, loadedImages };
  });

  // Handling DOM mutations
  useEffect(() => {
    const observer = new MutationObserver(() => {
      debouncedUpdateGeometry(treeRef.current, 'mutation');

      // find all images on any DOM change
      const allImages = debouncedCollectImages();
      setImages((prevState) => ({ ...prevState, allImages }));
    });
    // send initial geometry in case the tree is empty
    debouncedUpdateGeometry(treeRef.current, 'mutation');
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    return () => observer.disconnect();
  }, [debouncedCollectImages, debouncedUpdateGeometry]);

  // Handling image loading separately,
  // as each image can load at a different time, some might be hidden or lazy loaded
  useEffect(() => {
    let isCurrent = true;

    allImages.forEach(async (imageNode) => {
      if (loadedImages.has(imageNode)) {
        return;
      }
      // update the geometry after each image is loaded, as it can shift the layout
      await waitForImageToBeLoaded(imageNode);
      if (isCurrent) {
        loadedImages.add(imageNode);
        debouncedUpdateGeometry(treeRef.current, 'imageLoad');
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [allImages, loadedImages, debouncedUpdateGeometry]);
};
