export const getHeight = (elementId: string) => {
  const div = document.getElementById(`${elementId}`)
  return div?.offsetHeight
}
