/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MONITOR_API: string;
  readonly VITE_ERROR_API: string;
  readonly VITE_LOG_API: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
