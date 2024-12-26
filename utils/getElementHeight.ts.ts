export const getHeight = (elementId: string) => {
  const div = document.getElementById(`${elementId}`)
  const height = div?.clientHeight

  return height ? height + 2 : undefined
}
