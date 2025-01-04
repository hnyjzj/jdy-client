/**
 * 数组对象根据sort排序
 */
export function sortArr<T>(list: T) {
  const arr: FilterWhere<T>[] = []
  Object.entries(list as object).map((item) => {
    return arr.push({
      ...item[1],
    })
  })
  return arr.sort((a, b) => a.sort - b.sort)
}
