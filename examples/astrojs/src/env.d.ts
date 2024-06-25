/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CTFL_SPACE: string;
  readonly CTFL_ENVIRONMENT: string;
  readonly CTFL_ACCESS_TOKEN: string;
  readonly CTFL_PREVIEW_ACCESS_TOKEN: string;
  readonly CTFL_EXPERIENCE_TYPE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
