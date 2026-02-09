/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_COINGECKO_API_KEY: string
  readonly VITE_NEWSAPI_KEY: string
  // Add other env variables you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
