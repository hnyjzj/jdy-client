export function getStatusStyle<T extends number>(
  status: T,
  colorMap: Record<T, string>,
) {
  return {
    backgroundColor: colorMap[status] || '#C7DAFF',
  }
}
