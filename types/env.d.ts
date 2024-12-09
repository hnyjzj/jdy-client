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
  /**
   * 图片地址
   */
  readonly VITE_IMAGE_URL: string
  /**
   * 企业ID【企业微信】
   */
  readonly VITE_CORPID: string
}
