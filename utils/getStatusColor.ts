/**
 * 根据状态值返回对应的标签样式
 * @param status 状态值
 * @param colorMap 状态值与颜色映射表
 */
export function getStatusStyle<T extends number>(
  status: T,
  colorMap: Record<T, string>,
) {
  return {
    backgroundColor: colorMap[status] || '#C7DAFF',
  }
}
