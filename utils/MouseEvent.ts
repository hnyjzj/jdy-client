// 添加鼠标移动事件

export const addMouseEvent = (el: string) => {
  const container = document?.querySelector(el) as HTMLDivElement
  if (!container) {
    console.error(`Element with selector "${el}" not found`)
    return () => {}
  }
  let isMouseDown = false
  let startX = 0
  let scrollLeft = 0

  // 鼠标按下事件
  const onMouseDown = (e: MouseEvent) => {
    isMouseDown = true
    startX = e.pageX - container.offsetLeft
    scrollLeft = container.scrollLeft
  }
  // 鼠标移动事件
  const onMouseMove = (e: MouseEvent) => {
    if (!isMouseDown)
      return
    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = (x - startX) * 1 // 调整滚动速度
    container.scrollLeft = scrollLeft - walk
  }
  // 鼠标抬起事件
  const onMouseUp = () => {
    isMouseDown = false
  }
  // 鼠标离开事件
  const onMouseLeave = () => {
    isMouseDown = false
  }

  container.addEventListener('mousedown', (e) => {
    onMouseDown(e)
  })
  container.addEventListener('mouseleave', () => {
    onMouseLeave()
  })
  container.addEventListener('mouseup', () => {
    onMouseUp()
  })
  container.addEventListener('mousemove', (e) => {
    onMouseMove(e)
  })

  const removeEventListeners = () => {
    container.removeEventListener('mousedown', onMouseDown)
    container.removeEventListener('mouseleave', onMouseLeave)
    container.removeEventListener('mouseup', onMouseUp)
    container.removeEventListener('mousemove', onMouseMove)
  }
  return removeEventListeners
}