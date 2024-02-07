declare interface Window {
  __EB__: EB_Store;
}

type EB_Store = {
  isEditorMode?: boolean;
  sdkVersion?: string;
};
