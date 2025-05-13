import { useInsertionEffect } from 'react';

/**
 * This hook injects the passed styles on the client side within a new <style> tag.
 *
 * @param css: The CSS string to be injected.
 */
export const useInjectStylesheet = (css?: string) => {
  useInsertionEffect(() => {
    if (!css) {
      return;
    }

    const styleTag = document.createElement('style');
    styleTag.setAttribute('type', 'text/css');
    styleTag.innerHTML = css;

    // This might cause an error with `document.head` being undefined, e.g. when the client-side
    // hydration in SSR applications failed and thus the document is not initialized.
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, [css]);
};
