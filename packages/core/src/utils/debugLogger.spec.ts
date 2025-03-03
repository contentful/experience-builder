import { debug, DebugLogger } from './debugLogger';
import { describe, it, expect, vi } from 'vitest';

describe('debugLogger', () => {
  it('should not log anything if debug is not enabled', () => {
    const consoleLogSpy = vi.spyOn(console, 'log');
    debug.log('test');
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('should log if debug is enabled', () => {
    const consoleLogSpy = vi.spyOn(console, 'log');
    debug.setEnabled(true);
    debug.log('test');
    expect(consoleLogSpy).toHaveBeenCalledWith('[cf-experiences-sdk]', 'test');
  });

  it('should set cf_debug in localStorage when getting enabled', () => {
    const localStorageSpy = vi.spyOn(localStorage, 'setItem');
    debug.setEnabled(true);
    expect(localStorageSpy).toHaveBeenCalledWith('cf_debug', 'true');
  });

  it('should remove cf_debug in localStorage when getting disabled', () => {
    const localStorageSpy = vi.spyOn(localStorage, 'removeItem');
    debug.setEnabled(false);
    expect(localStorageSpy).toHaveBeenCalledWith('cf_debug');
  });

  it('should get initialised to the localStorage value if localStorage present', () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue('true');
    const debug2 = new DebugLogger();
    expect(debug2.getEnabled()).toBe(true);
  });

  describe('when localStorage is not available', () => {
    beforeEach(() => {
      Object.assign(window, { localStorage: undefined });
    });

    it('should still enable to logger', () => {
      debug.setEnabled(true);
      expect(debug.getEnabled()).toBe(true);
    });
  });
});
