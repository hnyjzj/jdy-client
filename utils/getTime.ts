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

/**
 *
 * @param timestamp 时间戳
 * @returns 日期时间
 */
export const formatTimestampToDateTime = (timestamp: string | Date) => {
  const date = new Date(timestamp)
  // 提取日期部分
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从 0 开始
  const day = String(date.getDate()).padStart(2, '0')
  // 提取时间部分
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  // 拼接为 YYYY-MM-DD HH:mm:ss 格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
