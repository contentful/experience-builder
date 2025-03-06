const CF_DEBUG_KEY = 'cf_debug';

export class DebugLogger {
  private static instance: DebugLogger | null = null;
  private enabled: boolean;

  constructor() {
    if (typeof localStorage === 'undefined') {
      this.enabled = false;
      return;
    }

    // Default to checking localStorage for the debug mode on initialization if in browser
    this.enabled = localStorage.getItem(CF_DEBUG_KEY) === 'true';
  }

  public static getInstance(): DebugLogger {
    if (this.instance === null) {
      this.instance = new DebugLogger();
    }
    return this.instance;
  }

  public getEnabled() {
    return this.enabled;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;

    if (typeof localStorage === 'undefined') {
      return;
    }
    if (enabled) {
      localStorage.setItem(CF_DEBUG_KEY, 'true');
    } else {
      localStorage.removeItem(CF_DEBUG_KEY);
    }
  }

  // Log method for different levels (error, warn, log)
  private logger(level: 'error' | 'log' | 'warn' | 'debug'): typeof console.log {
    return (...args) => {
      if (this.enabled) {
        console[level]('[cf-experiences-sdk]', ...args);
      }
    };
  }

  // Public methods for logging
  public error = this.logger('error');
  public warn = this.logger('warn');
  public log = this.logger('log');
  public debug = this.logger('debug');
}

export const debug = DebugLogger.getInstance();

export const enableDebug = () => {
  debug.setEnabled(true);
  console.log('Debug mode enabled');
};

export const disableDebug = () => {
  debug.setEnabled(false);
  console.log('Debug mode disabled');
};
