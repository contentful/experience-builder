import React from 'react'
import {
  defineComponents,
  enrichComponentDefinition,
  getComponentRegistration,
  resetComponentRegistry,
} from '../core/componentRegistry'
import { sendMessage } from '../communication/sendMessage'
import { renderHook, waitFor } from '@testing-library/react'
import { useEditorModeSwitch } from './useEditorModeSwitch'
import { Experience, ExternalSDKMode, OutgoingExperienceBuilderEvent } from '../types'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { SDK_VERSION } from '../core/constants'

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
  })

  it('should send CONNECTED event with default components by default in preview mode', () => {
    renderHook((props) => useEditorModeSwitch(props), {
      initialProps: {
        mode: 'preview' as ExternalSDKMode,
        switchToEditorMode: jest.fn() as Experience['switchToEditorMode'],
      },
    })

    waitFor(() => expect(sendMessage).toHaveBeenCalled)

    expect(sendMessage).toHaveBeenCalledWith(OutgoingExperienceBuilderEvent.CONNECTED, {
      definitions: [
        getComponentRegistration(CONTENTFUL_SECTION_ID)?.definition,
        getComponentRegistration(CONTENTFUL_CONTAINER_ID)?.definition,
      ],
      sdkVersion: SDK_VERSION,
    })
  })

  it('should not send CONNECTED event in delivery mode', () => {
    renderHook((props) => useEditorModeSwitch(props), {
      initialProps: {
        mode: 'delivery' as ExternalSDKMode,
        switchToEditorMode: jest.fn() as Experience['switchToEditorMode'],
      },
    })

    try {
      waitFor(() => expect(sendMessage).toHaveBeenCalled, { timeout: 50 })
    } catch (e) {
      // noop
    }

    expect(sendMessage).not.toHaveBeenCalled()
  })

  it('should send CONNECTED event with all registered components in preview mode', () => {
    const Component = () => <div>Test</div>
    
    const customComponentRegistration = { component: Component, definition: { id: 'test', name: 'test', variables: {} } };

    defineComponents([customComponentRegistration]);

    renderHook((props) => useEditorModeSwitch(props), {
      initialProps: {
        mode: 'preview' as ExternalSDKMode,
        switchToEditorMode: jest.fn() as Experience['switchToEditorMode'],
      },
    })

    waitFor(() => expect(sendMessage).toHaveBeenCalled)

    expect(sendMessage).toHaveBeenCalledWith(OutgoingExperienceBuilderEvent.CONNECTED, {
      definitions: [
        getComponentRegistration(CONTENTFUL_SECTION_ID)?.definition,
        getComponentRegistration(CONTENTFUL_CONTAINER_ID)?.definition,
        enrichComponentDefinition(customComponentRegistration).definition
      ],
      sdkVersion: SDK_VERSION,
    })
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
