const priority = [
  ['合计'],
  ['成品', '旧料', '配件'],
  ['收入', '支出'],
  ['销售', '退款'],
  ['兑换', '回收'],
  ['金额', '销售额', '件数'],
]

/**
 * 查找名称中包含层级中哪个关键词，并返回其索引
 * @param name 要检查的名称
 * @param level 优先级的一个层级
 * @returns 匹配到的关键词索引，未匹配到则返回-1
 */
function findMatchingIndex(name: string, level: string[]): number {
  for (let i = 0; i < level.length; i++) {
    if (name.includes(level[i])) {
      return i
    }
  }
  return -1
}

/**
 * 根据优先级列表对对象的键进行排序
 * @param obj 要排序的对象
 * @returns 排序后的新对象
 */
export function reorderObject(obj: Record<string, any>): Record<string, any> {
  // 获取对象的键值对并排序
  const sortedEntries = Object.entries(obj).sort(([keyA], [keyB]) => {
    // 遍历所有优先级层级进行比较
    for (const level of priority) {
      const indexA = findMatchingIndex(keyA, level)
      const indexB = findMatchingIndex(keyB, level)

      // 情况1：两个键都在当前层级找到匹配
      if (indexA !== -1 && indexB !== -1) {
        // 如果索引不同，直接返回比较结果
        if (indexA !== indexB) {
          return indexA - indexB
        }
        // 如果索引相同，继续检查下一层级
        continue
      }

      // 情况2：只有一个键在当前层级找到匹配，有匹配的排在前面
      if (indexA !== -1) {
        return -1
      }
      if (indexB !== -1) {
        return 1
      }

      // 情况3：两个键都不在当前层级，继续检查下一层级
    }

    // 所有层级都没有匹配，按默认字符串顺序排序
    return keyA.localeCompare(keyB)
  })

  // 将排序后的键值对转换回对象
  return Object.fromEntries(sortedEntries)
}
