/**
 * 筛选条件
 */
interface FilterWhere<T, N = keyof T> {
  /**
   * 筛选条件
   */
  label: string
  /**
   * 筛选预设
   */
  preset: null | object | array
  /**
   * 是否必填(仅添加上传时)
   */
  required: boolean
  type: number | string | float | string[]
  /**
   * 筛选类型 选择或输入
   */
  input: 'select' | 'text' | 'search' | 'switch' | 'number' | 'textarea' | 'date' | 'datetime' | 'multiple' | 'list' | 'upload' | 'password' | 'day' | 'radio'
  sort: number
  find: boolean
  /** 该字段是否可以添加上传 */
  create: boolean
  /** 是否页面显示 */
  info: boolean
  /** 是否列表显示 */
  list: boolean
  /** 是否可以更新 */
  update: boolean
  /** 字段名 */
  name: unknown & string & N
  /** */
  condition?: Condition<N>[]
}

/**
 *
 */
interface Condition<N> {
  key: N
  value: any
  operator: string
}

/**
 * 筛选对象
 *
 * {a:FilterWhere,b:FilterWhere}
 */
type Where<T = any> = { [key in keyof T]?: FilterWhere<T> }
