import { debug, DebugLogger } from './debugLogger';
import { describe, it, expect, vi } from 'vitest';

describe.only('debugLogger', () => {
  it('should not log anything if debug is not enabled', () => {
    const consoleLogSpy = vi.spyOn(console, 'log');
    debug.log('test');
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it.only('should log if debug is enabled', () => {
    const consoleLogSpy = vi.spyOn(console, 'log');
    debug.setActiveLevel('debug');
    debug.log('test');
    expect(consoleLogSpy).toHaveBeenCalledWith('test');
  });

  it('should set cf_debug in localStorage when getting enabled', () => {
    const localStorageSpy = vi.spyOn(localStorage, 'setItem');
    debug.setActiveLevel('debug');
    expect(localStorageSpy).toHaveBeenCalledWith('cf_debug', 'true');
  });

  it('should remove cf_debug in localStorage when getting disabled', () => {
    const localStorageSpy = vi.spyOn(localStorage, 'removeItem');
    debug.setActiveLevel('warn');
    expect(localStorageSpy).toHaveBeenCalledWith('cf_debug');
  });

  it('should get initialised to the localStorage value if localStorage present', () => {
    localStorage.setItem('cf_debug', 'true');
    const debug2 = new DebugLogger();
    expect(debug2.getActiveLevel()).toBe('debug');
  });

  describe('when localStorage is not available', () => {
    beforeEach(() => {
      Object.assign(window, { localStorage: undefined });
    });

    it('should still enable to logger', () => {
      debug.setActiveLevel('debug');
      expect(debug.getActiveLevel()).toBe('debug');
    });
  });
});
