/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_API_BASE?: string;
  readonly VITE_BACKEND_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

