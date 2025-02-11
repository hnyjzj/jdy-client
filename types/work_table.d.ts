interface WorkBench {
  id: string
  title: string
  name?: string
  path?: string
  children?: WorkBench[]
  parent_id?: string
  icon?: string
  /**
   * 是否折叠
   */
  is_fold?: boolean
}

interface WorkBenchReq {
  data?: WorkBench[]
  code: number
  message: string
}

type WorkTablesStatus = Record<string, boolean>

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
   * 是否可过滤
   */
  filterable?: boolean
}

interface AddWorkbencheReq {
  /**
   * 标题
   */
  title: string
  /**
   * 路径
   */
  path: string
  /**
   * 图标
   */
  icon: string
  /**
   * 父级ID
   */
  parent_id?: string
  id?: string
}

interface DelBenchRes {
  data: WorkBench[]
  code: number
}

interface UploadBencheReq {
  image: File
}
