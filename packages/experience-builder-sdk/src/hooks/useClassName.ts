import { useLayoutEffect, useState, useInsertionEffect } from 'react';

import {
  buildCfStyles,
  addMinHeightForEmptyStructures,
  buildStyleTag,
} from '@contentful/experiences-core';
import { ComponentTreeNode } from '@contentful/experiences-core/types';

/**
 * This hook can generate className and inject styles on a client side as a <style> tag
 * or it derives the className set on the server side
 *
 * @param node: the componenet node for which the styles will be injected
 * @param props: the props of the component, represented by the node
 * @returns the className that was eitner generated on the client side or derived from the value, set on server side
 */
export const useClassName = ({
  node,
  props,
}: {
  node: ComponentTreeNode;
  props: Record<string, any>;
}) => {
  const [className, setClassName] = useState<string>(props.cfSsrClassName ?? '');
  // Once our React support allows it (>=18), this should be implemented with useInsertionEffect.
  useLayoutEffect(() => {
    if (props.cfSsrClassName) {
      // class name has been already set on the server side. No need to calculate it on client side anymore
      return;
    }

    const cfStyles = addMinHeightForEmptyStructures(buildCfStyles(props), node);

    if (Object.keys(cfStyles).length === 0) {
      return;
    }

    const [className, styleRule] = buildStyleTag({ styles: cfStyles });

    if (!className || !styleRule) {
      return;
    }

    const styleTag = document.createElement('style');
    styleTag.dataset['cfStyles'] = className;

    setClassName(className);

    document.head.appendChild(styleTag).innerHTML = styleRule;
  }, [props, node]);

  return className;
};

export const useInjectStylesheet = (stylesheet?: { css: string; className: string }) => {
  useInsertionEffect(() => {
    if (!stylesheet) {
      return;
    }

    const styleTag = document.createElement('style');
    styleTag.setAttribute('type', 'text/css');
    styleTag.innerHTML = stylesheet.css;

    // This might cause an error with `document.head` being undefined, e.g. when the client-side
    // hydration in SSR applications failed and thus the document is not initialized.
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, [stylesheet]);
};
