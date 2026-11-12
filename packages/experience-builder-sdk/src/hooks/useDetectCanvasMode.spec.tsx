import { act, fireEvent, renderHook } from '@testing-library/react';
import { useDetectCanvasMode } from './useDetectCanvasMode';
import { INCOMING_EVENTS, StudioCanvasMode } from '@contentful/experiences-core/constants';
import * as experiencesCore from '@contentful/experiences-core';

describe('useDetectCanvasMode()', () => {
  let mismatchSchemaSpy: jest.SpyInstance;

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  beforeEach(() => {
    mismatchSchemaSpy = jest
      .spyOn(experiencesCore, 'doesMismatchMessageSchema')
      .mockReturnValue(false);
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

  describe('invalid messages', () => {
    it('logs a warning when a message comes from an unknown origin', () => {
      mismatchSchemaSpy.mockRestore();
      const warn = jest.spyOn(experiencesCore.debug, 'warn').mockImplementation(() => {});
      const origin = 'https://untrusted.example';
      const { result } = renderHook(() => useDetectCanvasMode({ isClientSide: true }));

      fireEvent(
        window,
        new MessageEvent('message', {
          origin,
          data: JSON.stringify({
            source: 'composability-app',
            eventType: 'requestEditorMode',
            payload: {},
          }),
        }),
      );

      expect(warn).toHaveBeenCalledWith(
        '[experience-builder-sdk::useDetectCanvasMode] Ignoring invalid message.',
        {
          origin,
          reason: `Message origin is not a trusted Studio origin: '${origin}'`,
        },
      );
      expect(result.current).toEqual(StudioCanvasMode.NONE);
    });
  });

  describe('message listener lifecycle', () => {
    it('removes the listener after the handshake times out', () => {
      jest.useFakeTimers();
      const addEventListener = jest.spyOn(window, 'addEventListener');
      const removeEventListener = jest.spyOn(window, 'removeEventListener');
      const tryParseMessage = jest.spyOn(experiencesCore, 'tryParseMessage').mockReturnValue({
        eventType: INCOMING_EVENTS.RequestEditorMode,
        payload: {
          // @ts-expect-error - no need to mock entire tree
          tree: {},
          locale: 'en-US',
        },
      });

      const { result } = renderHook(() => useDetectCanvasMode({ isClientSide: true }));
      const messageListener = addEventListener.mock.calls.find(
        ([eventType]) => eventType === 'message',
      )?.[1];

      expect(messageListener).toEqual(expect.any(Function));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(removeEventListener).toHaveBeenCalledWith('message', messageListener);

      fireEvent(window, new Event('message'));

      expect(tryParseMessage).not.toHaveBeenCalled();
      expect(result.current).toEqual(StudioCanvasMode.NONE);
    });

    it('removes the listener and clears the timeout when unmounted', () => {
      jest.useFakeTimers();
      const addEventListener = jest.spyOn(window, 'addEventListener');
      const removeEventListener = jest.spyOn(window, 'removeEventListener');
      const clearTimeout = jest.spyOn(global, 'clearTimeout');

      const { unmount } = renderHook(() => useDetectCanvasMode({ isClientSide: true }));
      const messageListener = addEventListener.mock.calls.find(
        ([eventType]) => eventType === 'message',
      )?.[1];

      expect(messageListener).toEqual(expect.any(Function));

      unmount();

      expect(removeEventListener).toHaveBeenCalledWith('message', messageListener);
      expect(clearTimeout).toHaveBeenCalled();
    });
  });
});
