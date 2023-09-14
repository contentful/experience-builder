/// <reference types="vite/client" />

import { CompositionMode } from '@contentful/experience-builder/dist/types';

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT_ID: string;
  readonly VITE_SPACE_ID: string;
  readonly VITE_ACCESS_TOKEN: string;
  readonly VITE_PREVIEW_ACCESS_TOKEN: string;
  readonly VITE_HOST: string;
  readonly VITE_PREVIEW_HOST: string;
  readonly VITE_EB_TYPE_ID: string;
  readonly VITE_EB_MODE: CompositionMode;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
