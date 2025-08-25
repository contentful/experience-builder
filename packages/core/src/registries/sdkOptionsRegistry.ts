import { SdkOptions } from '@/types';

export const sdkOptionsRegistry: SdkOptions = {};

/**
 * Used inside defineComponents to forward registry arguments to this registry
 * of SDK options.
 */
export const defineSdkOptions = (options: typeof sdkOptionsRegistry) => {
  Object.assign(sdkOptionsRegistry, options);
};

export const getSdkOptions = (): Readonly<typeof sdkOptionsRegistry> => {
  return { ...sdkOptionsRegistry };
};
