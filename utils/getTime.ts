export const getDayAndWeek = (date?: Date) => {
  const currentDate = date || new Date()
  const month = currentDate.getMonth() + 1 // 月份从 0 开始，所以要加 1
  const day = currentDate.getDate()
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const dayOfWeek = weekDays[currentDate.getDay()]
  return `${month}月${day}号，${dayOfWeek}`
}

export const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12)
    return '早上好'
  if (hour < 18)
    return '下午好'
  return '晚上好'
}
