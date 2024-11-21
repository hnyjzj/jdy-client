type types =
  | 'error'
  | 'warning'
  | 'success'
  | 'primary'

interface Props {
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
   * 请预留1000毫秒的动画时间
   * @example 如期望展示时间3000毫秒，则 duration 为 3000 + 1000 = 4000
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
