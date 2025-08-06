/** 类型扩展分页所有需类型 */
type ExpandPage<T> = T & {
  searchPage?: number
  limits?: number
  showtype?: 'list' | 'table'
}
