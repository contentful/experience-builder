// Object to store the SDK features that are enabled/disabled
export const sdkFeatures: Record<string, unknown> = {
  hasSDKVersionUI: true,
  hasVersionHistory: true,
  cfVisibility: true,
  patternResolution: true,
  // DND is moving to the host application enabling smoother native event handling
  nativeDnd: true,
};
