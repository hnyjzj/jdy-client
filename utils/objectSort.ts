/**
 * Return a new object whose keys (and nested plain-object keys) are reordered according to a fixed priority list.
 *
 * Reorders entries so keys that include any of the priority tokens ['合计','收入','支出','销售','回收','成品','旧料','配件']
 * appear first in priority order (match is by substring). Non-matching keys are placed after prioritized keys in their
 * original relative order determined by the sort. For any value that is a plain object (non-null and not an array),
 * the function is applied recursively; arrays and other values are left unchanged. If `obj` has no keys, it is
 * returned as-is.
 *
 * @param obj - The input object to reorder. Only plain objects are recursively processed; arrays are preserved.
 * @returns A new object with keys reordered according to the priority rules.
 */
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
