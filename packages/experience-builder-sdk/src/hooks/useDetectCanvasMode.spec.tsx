import { fireEvent, renderHook } from '@testing-library/react';
import { useDetectCanvasMode } from './useDetectCanvasMode';
import { INCOMING_EVENTS, StudioCanvasMode } from '@contentful/experiences-core/constants';
import * as experiencesCore from '@contentful/experiences-core';

describe('useDetectCanvasMode()', () => {
  beforeEach(() => {
    jest.spyOn(experiencesCore, 'doesMismatchMessageSchema').mockReturnValue(false);
  });

  describe('SSR', () => {
    it('returns mode: null', () => {
      const { result } = renderHook(() => useDetectCanvasMode({ isClientSide: true }));

      expect(result.current).toEqual(StudioCanvasMode.NONE);
    });
  });

  describe('editor mode', () => {
    it('listens for "INCOMING_EVENTS.RequestEditorMode" post message', async () => {
      jest.spyOn(experiencesCore, 'tryParseMessage').mockReturnValue({
        eventType: INCOMING_EVENTS.RequestEditorMode,
        payload: {
          // @ts-expect-error - no need to mock entire tree
          tree: {},
          locale: 'en-US',
        },
      });

      const { result } = renderHook(() => useDetectCanvasMode({ isClientSide: true }));
      fireEvent(window, new CustomEvent('message', {}));

      expect(result.current).toEqual(StudioCanvasMode.EDITOR);
    });
  });

  describe('read only mode', () => {
    it('listens for "INCOMING_EVENTS.RequestReadOnlyMode" post message', async () => {
      jest.spyOn(experiencesCore, 'tryParseMessage').mockReturnValue({
        eventType: INCOMING_EVENTS.RequestReadOnlyMode,
        payload: {
          // @ts-expect-error - no need to mock entire tree
          tree: {},
          locale: 'en-US',
        },
      });

      const { result } = renderHook(() => useDetectCanvasMode({ isClientSide: true }));
      fireEvent(window, new CustomEvent('message', {}));

      expect(result.current).toEqual(StudioCanvasMode.READ_ONLY);
    });
  });
});
