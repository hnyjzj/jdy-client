interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  /**
   * 基础 URL
   */
  readonly VITE_BASE_URL: string
}
