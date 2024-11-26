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
   * success | error | warning | primary
   *
   * @default primary
   */
  type?: types

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
   * 自定义样式
   */
  style?: ToastStyle
}

export interface ToastStyle {
  backgroundColor?: string
  color?: string
  iconBg?: string
}

export type ToastStyles = { [key in types]: ToastStyle }
export type ToastIcons = { [key in types]: Toast['icon'] }
