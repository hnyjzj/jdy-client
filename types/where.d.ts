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
  input: 'select' | 'text' | 'search' | 'switch' | 'number' | 'textarea' | 'date' | 'multiple'
  sort: number
  find: boolean
  create: boolean
  update: boolean
  name: unknown & string & N
}
/**
 * 筛选对象
 *
 * {a:FilterWhere,b:FilterWhere}
 */
type Where<T = any> = { [key in keyof T]?: FilterWhere<T> }
