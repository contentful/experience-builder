import { CSSProperties } from 'react';
import { renderHook } from '@testing-library/react';
import { useEditorModeClassName } from './useEditorModeClassName';
import { describe, it, expect, vi } from 'vitest';
import { buildStyleTag } from '@contentful/experiences-core';

describe('useEditorModeClassName', () => {
  // This case is currently not occurring but the function is ensured to handle this case correctly
  describe('when given an empty set of styles', () => {
    it('should yield an empty class name', () => {
      const { result } = renderHook(() =>
        useEditorModeClassName({ styles: {}, nodeId: 'test-node-id' }),
      );

      expect(result.current).toStrictEqual('');
    });
  });

  describe('when styles are given', () => {
    const styles: CSSProperties = { display: 'grid', color: 'snow' };

    it('should yield a non-empty class name in its first render pass', () => {
      const { result } = renderHook(() =>
        useEditorModeClassName({ styles, nodeId: 'test-node-id' }),
      );

      // expects format "cfstyles-" + node id
      expect(result.current).toBe('cfstyles-test-node-id');
    });

    it('should check for an existing style tag in the document', () => {
      const innerHTMLSetterMock = vi.fn();
      const querySelectorSpy = vi.spyOn(document, 'querySelector').mockReturnValueOnce({
        set innerHTML(v: string) {
          innerHTMLSetterMock(v);
        },
      } as unknown as HTMLElement);

      const { result } = renderHook(() => useEditorModeClassName({ styles, nodeId: 'id-of-node' }));

      expect(querySelectorSpy).toHaveBeenCalledWith(`[data-cf-styles="${result.current}"]`);
      expect(innerHTMLSetterMock).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe('when the node id is missing', () => {
    const previousStyles = { color: 'red' };
    const previousClassName = buildStyleTag({ styles: previousStyles, nodeId: '' })[0];
    const nextStyles = { color: 'blue' };
    const nextClassName = buildStyleTag({ styles: nextStyles, nodeId: '' })[0];

    it('should remove an outdated style tag', () => {
      const querySelectorSpy = vi.spyOn(document, 'querySelector');
      const removeChildSpy = vi.spyOn(document.head, 'removeChild').mockImplementation(vi.fn());
      const fakeStyleNode = document.createElement('style');

      const { rerender } = renderHook((styles: typeof previousStyles = previousStyles) =>
        useEditorModeClassName({ styles, nodeId: '' }),
      );
      expect(querySelectorSpy).toHaveBeenCalledWith(`[data-cf-styles="${previousClassName}"]`);

      querySelectorSpy.mockImplementation((selector) => {
        if (selector.includes(previousClassName)) {
          return fakeStyleNode;
        }
        return null;
      });
      rerender(nextStyles);
      expect(querySelectorSpy).toHaveBeenCalledWith(`[data-cf-styles="${nextClassName}"]`);
      expect(removeChildSpy).toHaveBeenCalledWith(fakeStyleNode);
    });
  });
});
