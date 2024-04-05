import { CSSProperties } from 'react';
import { renderHook } from '@testing-library/react';
import { useStyleTag } from './useStyleTag';

describe('useStyleTag', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('when given an empty set of styles', () => {
    it('should yield an empty class name', () => {
      const { result } = renderHook(() => useStyleTag({ styles: {} }));

      expect(result.current.className).toStrictEqual('');
    });
  });

  describe('when styles are given', () => {
    const styles: CSSProperties = { display: 'grid', color: 'snow' };

    it('should yield a non-empty class name in its first render pass', () => {
      const { result } = renderHook(() => useStyleTag({ styles }));

      // expects format "cfstyles-" + 32 char suffix (MD5)
      expect(result.current.className).toMatch(/^cfstyles-\w{32}$/);
    });

    describe('when given a nodeId', () => {
      it('should check for an existing style tag in the document', () => {
        const innerHTMLSetterMock = jest.fn();
        const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValueOnce({
          set innerHTML(v: string) {
            innerHTMLSetterMock(v);
          },
        } as unknown as HTMLElement);

        const { result } = renderHook(() => useStyleTag({ styles, nodeId: 'id-of-node' }));

        expect(querySelectorSpy).toHaveBeenCalledWith(
          `[data-cf-styles="${result.current.className}"]`,
        );
        expect(innerHTMLSetterMock).toHaveBeenCalledWith(expect.any(String));
      });
    });

    describe('when no nodeId is present', () => {
      it('should create a new style tag', () => {
        const appendChildSpy = jest.spyOn(document.head, 'appendChild');

        renderHook(() => useStyleTag({ styles }));

        expect(appendChildSpy).toHaveBeenCalledWith(expect.any(HTMLStyleElement));
        expect(appendChildSpy.mock.lastCall?.[0]).toHaveAttribute('data-cf-styles');
      });
    });
  });
});
