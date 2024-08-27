import { fireEvent, renderHook } from '@testing-library/react';
import { useDetectMode } from './useDetectMode';
import { INCOMING_EVENTS, StudioExperienceMode } from '@contentful/experiences-core/constants';
import * as experiencesCore from '@contentful/experiences-core';

describe('useDetectMode()', () => {
  beforeEach(() => {
    jest.spyOn(experiencesCore, 'doesMismatchMessageSchema').mockReturnValue(false);
  });

  describe('SSR', () => {
    it('returns mode: null', () => {
      const { result } = renderHook(() => useDetectMode({ isClientSide: true }));

      expect(result.current).toEqual(StudioExperienceMode.NONE);
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

      const { result } = renderHook(() => useDetectMode({ isClientSide: true }));
      fireEvent(window, new CustomEvent('message', {}));

      expect(result.current).toEqual(StudioExperienceMode.EDITOR);
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

      const { result } = renderHook(() => useDetectMode({ isClientSide: true }));
      fireEvent(window, new CustomEvent('message', {}));

      expect(result.current).toEqual(StudioExperienceMode.READ_ONLY);
    });
  });
});
