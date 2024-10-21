import { useLayoutEffect, useState } from 'react';
import { buildStyleTag } from '@contentful/experiences-core';
import type { CSSProperties } from '@contentful/experiences-core/types';

/**
 * @param styles: the list of styles to apply
 * @param nodeId: the id of node that these styles will be applied to
 * @returns className: the className that was used
 * Builds and adds a style tag in the document. Returns the className to be attached to the element.
 * In editor mode the nodeId is used as the identifier in order to avoid creating endless tags as the styles are tweeked
 */
export const useEditorModeClassName = ({
  styles,
  nodeId,
}: {
  styles: CSSProperties;
  nodeId: string;
}) => {
  const [className, setClassName] = useState('');

  useLayoutEffect(() => {
    if (Object.keys(styles).length === 0) {
      return;
    }

    const [className, styleRule] = buildStyleTag({ styles, nodeId });

    setClassName(className);

    const existingTag = document.querySelector(`[data-cf-styles="${className}"]`);

    if (existingTag) {
      existingTag.innerHTML = styleRule;
      return;
    }

    const styleTag = document.createElement('style');
    styleTag.dataset['cfStyles'] = className;

    document.head.appendChild(styleTag).innerHTML = styleRule;
  }, [styles, nodeId]);

  return className;
};
