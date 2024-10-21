declare interface Window {
  __EB__: EB_Store;
}

type EB_Store = {
  isReadOnlyMode?: boolean;
  isEditorMode?: boolean;
  sdkVersion?: string;
};
