type ColumnAlign = 'left' | 'center' | 'right'

interface Column {
  id?: string
  /**
   * 字段名
   */
  field: string
  /**
   * 表头名
   */
  header: string
  width?: number | string
  minWidth?: number | string
  maxWidth?: number | string
  realWidth?: number | string
  /**
   * 左侧列是否固定
   */
  fixedLeft?: string
  /**
   * 右侧列是否固定
   */
  fixedRight?: string
  /**
   * 是否可过滤 filterable?: boolean
   */
}
