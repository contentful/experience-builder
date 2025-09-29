// Object to store the SDK features that are enabled/disabled
export const sdkFeatures: Record<string, unknown> = {
  hasSDKVersionUI: true,
  hasVersionHistory: true,
  cfVisibility: true,
  patternResolution: true,
  // [SPA-2602] allow merging the default and overwriting design values for patterns by breakpoint
  patternBreakpointDesignValues: true,
  // DND is moving to the host application enabling smoother native event handling
  dndMigration: true,
  hasPrebinding: true,
};
