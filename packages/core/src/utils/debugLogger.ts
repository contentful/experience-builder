const CF_DEBUG_KEY = 'cf_debug';

/**
 * To ensure that the localStorage API can be used safely, we check
 * for availability (e.g. undefined in Node.js). Additionally, we
 * check if the localStorage can be used as some browsers throw a
 * SecurityError (e.g. Brave or Chromium with specific settings).
 */
const checkLocalStorageAvailability = () => {
  try {
    // Even the typeof check can throw an error in an agressive browser like Brave (requires using the deprecated flag #block-all-cookies-toggle)
    if (typeof localStorage === 'undefined' || localStorage === null) {
      return false;
    }
    // Attempt to set and remove an item to check if localStorage is enabled
    const TEST_KEY = 'cf_test_local_storage';
    localStorage.setItem(TEST_KEY, 'yes');
    if (localStorage.getItem(TEST_KEY) === 'yes') {
      localStorage.removeItem(TEST_KEY);
      return true;
    } else {
      return false;
    }
  } catch (_error) {
    return false;
  }
};

const DEBUG_LEVELS_HIERARCHY = ['error', 'warn', 'log', 'debug'] as const;
type DEBUG_LEVEL = (typeof DEBUG_LEVELS_HIERARCHY)[number];

export class DebugLogger {
  private static instance: DebugLogger | null = null;
  private activeLevel: DEBUG_LEVEL = 'warn';

  constructor() {
    if (!checkLocalStorageAvailability()) {
      return;
    }

    // Default to checking localStorage for the debug mode on initialization if in browser
    if (localStorage.getItem(CF_DEBUG_KEY) === 'true') {
      this.activeLevel = 'debug';
    }
  }

  public static getInstance(): DebugLogger {
    if (this.instance === null) {
      this.instance = new DebugLogger();
    }
    return this.instance;
  }

  public getActiveLevel() {
    return this.activeLevel;
  }

  public setActiveLevel(level: DEBUG_LEVEL) {
    this.activeLevel = level;

    if (!checkLocalStorageAvailability()) {
      return;
    }
    if (this.activeLevel === 'debug') {
      localStorage.setItem(CF_DEBUG_KEY, 'true');
    } else {
      localStorage.removeItem(CF_DEBUG_KEY);
    }
  }

  // Log method for different levels (error, warn, log)
  private logger(level: DEBUG_LEVEL): typeof console.log {
    const levelPriority = DEBUG_LEVELS_HIERARCHY.indexOf(level);
    const activeLevelPriority = DEBUG_LEVELS_HIERARCHY.indexOf(this.activeLevel);
    const enabled = levelPriority <= activeLevelPriority;
    return (...args: unknown[]) => {
      if (enabled) {
        console[level](...args);
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

/** Set the logging level to `debug` */
export const enableDebug = () => {
  debug.setActiveLevel('debug');
  console.log('Debug mode enabled');
};

/** Set the debug level to `warn` */
export const disableDebug = () => {
  debug.setActiveLevel('warn');
  console.log('Debug mode disabled');
};

/** Set the debug level to the provided level */
export const setDebugLevel = (level: DEBUG_LEVEL) => {
  debug.setActiveLevel(level);
  console.log(`Debug mode set to ${level}`);
};
