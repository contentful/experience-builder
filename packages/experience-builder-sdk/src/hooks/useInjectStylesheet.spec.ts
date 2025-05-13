import { renderHook } from '@testing-library/react';
import { useInjectStylesheet } from './useInjectStylesheet';

describe('useInjectStylesheet', () => {
  const css = 'body { background: red; }';

  it('should inject and remove styles', () => {
    const { unmount } = renderHook(() => useInjectStylesheet(css));

    const styleTag = document.head.querySelector('style');
    expect(styleTag).not.toBeNull();
    expect(styleTag?.innerHTML).toBe(css);

    unmount();

    expect(document.head.querySelector('style')).toBeNull();
  });
});
