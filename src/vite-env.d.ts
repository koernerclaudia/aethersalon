/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // add other VITE_* you use:
  // readonly VITE_SOMETHING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
