/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIVE_DATA_REFRESH_MS?: string;
  readonly VITE_LIVE_DATA_IDLE_RETRY_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
