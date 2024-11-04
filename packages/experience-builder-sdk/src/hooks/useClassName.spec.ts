import { renderHook } from '@testing-library/react';
import { useClassName } from './useClassName';
import { ComponentTreeNode } from '@contentful/experiences-core/types';

describe('useClassName', () => {
  describe('when styles are given', () => {
    const testNode: ComponentTreeNode = {
      definitionId: 'test-definition-id',
      children: [],
      variables: {},
    };

    it('should yield a non-empty class name in its first render pass', async () => {
      const testProps = { cfFontSize: '1rem', cfBackgroundColor: 'snow' };
      const { result } = renderHook(() => useClassName({ node: testNode, props: testProps }));

      // expects format "cfstyles-" + 32 char suffix (MD5)
      expect(result.current).toMatch(/^cfstyles-\w{32}$/);
    });

    it('should return class name set on server side if present', () => {
      const testProps = {
        cfFontSize: '1rem',
        cfBackgroundColor: 'snow',
        cfSsrClassName: 'test-ssr-class',
      };
      const { result } = renderHook(() => useClassName({ node: testNode, props: testProps }));

      // expects format "cfstyles-" + 32 char suffix (MD5)
      expect(result.current).toBe('test-ssr-class');
    });
  });
});
