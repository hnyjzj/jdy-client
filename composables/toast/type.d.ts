export type types =
  | 'error'
  | 'warning'
  | 'success'
  | 'primary'

export interface Toast {
  /**
   * 文本内容
   */
  message: string
  /**
   * 提示主题
   * 'error' | 'warning' | 'success' | 'primary'
   */
  theme?: types
  /**
   * 显示时长
   *
   * @default 3000
   */
  duration?: number
  /**
   * icon
   */
  icon?: string
  /**
   * 网格列开始
   */
  colStart?: number
  /**
   * 网格列跨度
   */
  colSpan?: number
  /**
   * 距顶部距离
   * @param {number} top - 元素的垂直位置，单位为百分比（%）
   */
  top?: number
}

export interface ToastOptions extends Toast {
  id: string
  /**
   * 清理计时器
   */
  timer: NodeJS.Timeout
}

export type Toasts = {
  backgroundColor?: string
  color?: string
  iconBg?: string
} & Partial<Toast>

export interface ToastOptions extends Toast {
  id: string
}
