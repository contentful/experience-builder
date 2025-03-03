const CF_DEBUG_KEY = 'cf_debug';

class Debugger {
  private static instance: Debugger | null = null;
  private enabled: boolean;

  constructor() {
    // Default to checking localStorage for the debug mode on initialization if in browser
    if (typeof localStorage === 'undefined') {
      this.enabled = false;
      return;
    }

    this.enabled = localStorage.getItem(CF_DEBUG_KEY) === 'true';
  }

  public static getInstance(): Debugger {
    if (this.instance === null) {
      this.instance = new Debugger();
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
  private logger(level: 'error' | 'log' | 'warn'): typeof console.log {
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
}

export const debug = Debugger.getInstance();

export const enableDebug = () => {
  debug.setEnabled(true);
  console.log('Debug mode enabled');
};

export const disableDebug = () => {
  debug.setEnabled(false);
  console.log('Debug mode disabled');
};
