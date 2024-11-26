interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  /**
   * 基础 URL
   */
  readonly VITE_BASE_URL: string
  /**
   * 接口地址
   */
  readonly VITE_BASE_API: string
}
