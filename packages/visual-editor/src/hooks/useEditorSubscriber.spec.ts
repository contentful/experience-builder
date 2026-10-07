import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { inMemoryEntitiesStore } from '@contentful/experiences-core';
import { useEditorSubscriber } from './useEditorSubscriber';

vi.mock('@contentful/experiences-core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@contentful/experiences-core')>();
  return { ...actual, sendMessage: vi.fn() };
});

describe('useEditorSubscriber', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // zustand v5 uses React.useSyncExternalStore directly, so a selector that returns a new object
  // on every call (without useShallow) triggers "The result of getSnapshot should be cached to avoid
  // an infinite loop" and then "Maximum update depth exceeded".
  it('does not trigger an infinite render loop on mount', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useEditorSubscriber(inMemoryEntitiesStore))).not.toThrow();

    const messages = consoleError.mock.calls.map((args) => String(args[0]));
    expect(messages.some((m) => m.includes('getSnapshot should be cached'))).toBe(false);
    expect(messages.some((m) => m.includes('Maximum update depth exceeded'))).toBe(false);
  });
});
