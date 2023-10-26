import { resetComponentRegistry } from '../core/componentRegistry'
import { sendMessage } from '../communication/sendMessage'
import { renderHook, waitFor } from '@testing-library/react'
import { useEditorModeSwitch } from './useEditorModeSwitch'
import { Experience, ExternalSDKMode } from '../types'
import { OUTGOING_EVENTS } from '../constants'

jest.mock('../communication/sendMessage')
jest.mock('../core/constants', () => {
  return {
    SDK_VERSION: '0.0.0-test',
    CONTENTFUL_SECTION_ID: 'contentful-section',
    CONTENTFUL_CONTAINER_ID: 'contentful-container',
    __esModule: true,
  }
})

describe('useEditorModeSwitch', () => {
  beforeEach(() => {
    resetComponentRegistry()
    ;(sendMessage as jest.Mock).mockReset()
  })

  it('should send CONNECTED event without payload in preview mode', () => {
    renderHook((props) => useEditorModeSwitch(props), {
      initialProps: {
        mode: 'preview' as ExternalSDKMode,
        switchToEditorMode: jest.fn() as Experience['switchToEditorMode'],
      },
    })

    expect(sendMessage).toHaveBeenCalledWith(OUTGOING_EVENTS.Connected)
  })

  it('should not send CONNECTED event in delivery mode', () => {
    renderHook((props) => useEditorModeSwitch(props), {
      initialProps: {
        mode: 'delivery' as ExternalSDKMode,
        switchToEditorMode: jest.fn() as Experience['switchToEditorMode'],
      },
    })

    try {
      waitFor(() => expect(sendMessage).toHaveBeenCalled(), { timeout: 50 })
    } catch (e) {
      // noop
    }

    expect(sendMessage).not.toHaveBeenCalled()
  })

  it('should switch the mode to editor when it receives a REQUEST_EDITOR_MODE message', () => {
    const switchToEditorMode = jest.fn() as Experience['switchToEditorMode']

    renderHook((props) => useEditorModeSwitch(props), {
      initialProps: {
        mode: 'preview' as ExternalSDKMode,
        switchToEditorMode,
      },
    })
  })
})
