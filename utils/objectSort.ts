export function reorderObject(obj: Record<string, any>): Record<string, any> {
  if (Object.keys(obj).length === 0)
    return obj

  const priority = ['合计', '收入', '支出', '销售', '回收', '成品', '旧料', '配件']

  const entries = Object.entries(obj)

  const sorted = entries
    .map(([key, value]) => {
      // 如果还是对象，递归处理
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return [key, reorderObject(value)]
      }
      return [key, value]
    })
    .sort(([keyA], [keyB]) => {
      const idxA = typeof keyA === 'string'
        ? priority.findIndex(p => keyA.includes(p))
        : -1
      const idxB = typeof keyB === 'string'
        ? priority.findIndex(p => keyB.includes(p))
        : -1

      return (idxA === -1 ? Infinity : idxA) - (idxB === -1 ? Infinity : idxB)
    })

  return Object.fromEntries(sorted)
}
