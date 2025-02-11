export const filterByKeyword = (data: WorkBench[], keyword: string) => {
  function filterData(data: WorkBench[], keyword: string) {
    // 返回一个新数组，包含所有包含关键词的节点
    return data.filter((item) => {
      if (item.children) {
        // 递归处理子节点
        item.children = filterData(item.children, keyword)
        if (item.children.length > 0) {
          return true
        }
      }
      // 检查当前节点是否为第三层且包含关键词
      return item.title.includes(keyword)
    })
  }

  return filterData(data, keyword)
}
