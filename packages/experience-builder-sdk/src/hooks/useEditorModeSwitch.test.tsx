import { resetComponentRegistry } from '../core/componentRegistry';
import { sendMessage } from '@contentful/experience-builder-core';
import { renderHook } from '@testing-library/react';
import { useEditorModeSwitch } from './useEditorModeSwitch';
import type { ExternalSDKMode } from '@contentful/experience-builder-core/types';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';

jest.mock('@contentful/experience-builder-core');

describe('useEditorModeSwitch', () => {
  beforeEach(() => {
    resetComponentRegistry();
    (sendMessage as jest.Mock).mockReset();
  });

  it('should send CONNECTED event without payload in preview mode', () => {
    renderHook((props) => useEditorModeSwitch(props), {
      initialProps: {
        mode: 'preview' as ExternalSDKMode,
        switchToEditorMode: jest.fn() as () => void,
      },
    });

    expect(sendMessage).toHaveBeenCalledWith(OUTGOING_EVENTS.Connected);
  });

  it('should switch the mode to editor when it receives a REQUEST_EDITOR_MODE message', () => {
    const switchToEditorMode = jest.fn() as () => void;

    renderHook((props) => useEditorModeSwitch(props), {
      initialProps: {
        mode: 'preview' as ExternalSDKMode,
        switchToEditorMode,
      },
    });
  });
});
