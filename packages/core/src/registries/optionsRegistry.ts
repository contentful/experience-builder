import { ComponentRegistrationOptions } from '@/types';

export let sdkOptionsRegistry: Pick<
  ComponentRegistrationOptions,
  '__enableOldTextAlignmentValues'
> = {};

/**
 * Register custom breakpoints
 * @param breakpoints - [{[key:string]: string}]
 * @returns void
 */
export const defineSdkOptions = (options: typeof sdkOptionsRegistry) => {
  Object.assign(sdkOptionsRegistry, options);
};

export const getSdkOptions = (): Readonly<typeof sdkOptionsRegistry> => {
  return sdkOptionsRegistry;
};
