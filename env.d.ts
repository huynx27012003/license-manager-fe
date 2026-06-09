/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AT_LICENSE_HOST: string
  readonly VITE_AT_LICENSE_MODE: string
  readonly VITE_AT_LICENSE_VERSION: string
  readonly VITE_AT_LICENSE_ACCOUNT_ID: string
  readonly VITE_AT_LICENSE_EDITION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string
