/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALPHA_VANTAGE_KEY?: string
  readonly VITE_FINNHUB_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
