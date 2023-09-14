/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT_ID: string;
  readonly VITE_SPACE_ID: string;
  readonly VITE_ACCESS_TOKEN: string;
  readonly VITE_PREVIEW_ACCESS_TOKEN: string;
  readonly VITE_EB_TYPE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
