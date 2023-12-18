/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT_ID: string;
  readonly VITE_CONTENTFUL_ENV: string;
  readonly VITE_SPACE_ID: string;
  readonly VITE_ACCESS_TOKEN: string;
  readonly VITE_PREVIEW_ACCESS_TOKEN: string;
  readonly VITE_EB_TYPE_ID: string;
  readonly VITE_VISUAL_EDITOR_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
