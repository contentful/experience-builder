import { CSSProperties } from 'react';
import { renderHook } from '@testing-library/react';
import { useEditorModeClassName } from './useEditorModeClassName';
import { describe, it, expect, vi } from 'vitest';

describe('useEditorModeClassName', () => {
  // TODO: address me
  // the test doesn't reflect the reality
  // because buildCfStyles function never returns an empty object
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
});
