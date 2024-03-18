import { useLayoutEffect, useMemo } from 'react';

import { buildStyleTag } from '@contentful/experiences-core';
import type { CSSProperties } from '@contentful/experiences-core/types';

/**
 *
 * @param styles: the list of styles to apply
 * @param nodeId: [Optional] the id of node that these styles will be applied to
 * @returns className: the className that was used
 * Builds and adds a style tag in the document. Returns the className to be attached to the element.
 * In editor mode the nodeId is used as the identifier in order to avoid creating endless tags as the styles are tweeked
 * In preview/delivery mode the styles don't change oftem so we're using the md5 hash of the content of the tag
 */
export const useStyleTag = ({ styles, nodeId }: { styles: CSSProperties; nodeId?: string }) => {
  const [className, styleRule] = useMemo((): string[] => {
    if (Object.keys(styles).length === 0) {
      return [''];
    }

    return buildStyleTag({ styles, nodeId });
  }, [styles, nodeId]);

  // Once our React support allows it (>=18), this should be implemented with useInsertionEffect.
  useLayoutEffect(() => {
    if (!className || !styleRule) {
      return;
    }

    const existingTag = document.querySelector(`[data-cf-styles="${className}"]`);

    if (existingTag) {
      // editor mode - update existing
      if (nodeId) {
        existingTag.innerHTML = styleRule;
      }
      // preview/delivery mode - here we don't need to update the existing tag because
      // the className is based on the md5 hash of the content so it hasn't changed
      return;
    }

    const styleTag = document.createElement('style');
    styleTag.dataset['cfStyles'] = className;

    document.head.appendChild(styleTag).innerHTML = styleRule;
  }, [className, nodeId, styleRule]);

  return { className };
};
