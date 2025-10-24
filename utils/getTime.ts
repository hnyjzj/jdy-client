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
 * 转化为日期格式
 * @param timestamp 时间戳
 * @returns 日期时间
 */
export const formatTimestampToDateTime = (timestamp: string | Date) => {
  if (!timestamp) {
    return ''
  }
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
/**
 * 转化为日期格式
 * @param isoString 2025-04-24T13:21:33+08:00
 * @returns 日期时间
 */
export function formatISODate(isoString: string) {
  // 将ISO字符串转换为Date对象
  if (!isoString)
    return '--'
  const date = new Date(isoString)

  // 提取各时间组件（自动处理时区转换）
  const year = date.getFullYear() // 获取年份
  const month = String(date.getMonth() + 1).padStart(2, '0') // 获取月份，并确保两位数
  const day = String(date.getDate()).padStart(2, '0') // 获取日期，并确保两位数
  const hours = String(date.getHours()).padStart(2, '0') // 获取小时，并确保两位数
  const minutes = String(date.getMinutes()).padStart(2, '0') // 获取分钟，并确保两位数
  const seconds = String(date.getSeconds()).padStart(2, '0') // 获取秒数，并确保两位数

  // 拼接目标格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 计算目标日期距离当前日期多少天
 * @param targetDate 目标日期
 * @returns 相差的天数
 */
export const getDaysFromToday = (targetDate: Date | string) => {
  if (!targetDate)
    return
  const today = new Date()
  today.setHours(0, 0, 0, 0) // 去掉时间部分，只保留日期

  const date = new Date(targetDate)
  date.setHours(0, 0, 0, 0)

  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * 日期转换为Excel日期序列号
 * @param dateStr 日期字符串
 * @returns 序列号
 */
export function dateStringToExcelSerial(dateStr: string): number {
  const date = new Date(dateStr.replace(' ', 'T'))
  const excelEpoch = new Date('1899-12-30T00:00:00Z') // Excel day 1 is 1900-01-01
  const diffMs = date.getTime() - excelEpoch.getTime()
  return diffMs / (1000 * 60 * 60 * 24)
}
/**
 * 将excel日期序列号转换为日期
 * @param serial excel日期序列号
 * @returns 日期
 */
export const excelSerialToDate = (serial: number | string): string => {
  if (!serial || Number.isNaN(Number(serial)))
    return ''

  if (typeof serial === 'string') {
    serial = Number(serial)
  }

  // Excel 起点 1899-12-30
  const base = new Date(Date.UTC(1899, 11, 30))

  // 分钟 = 总天数 * 1440
  const totalMinutes = Math.round(serial * 24 * 60)

  // 得到最终时间
  const date = new Date(base.getTime() + totalMinutes * 60 * 1000)

  const yyyy = date.getUTCFullYear()
  const MM = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  const hh = String(date.getUTCHours()).padStart(2, '0')
  const mm = String(date.getUTCMinutes()).padStart(2, '0')

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}`
}

export const toFixedChinaISOString = (input: string): string => {
  if (!input)
    return ''
  const [dateStr, timeStr] = input.split(' ')
  return `${dateStr}T${timeStr}:00+08:00`
}

export const dateDisabled = (ts: number) => {
  const date = new Date(ts).getTime()
  const now = new Date().getTime()
  return now < date
}

/**
 * 当前时间是否在指定时间范围内
 */
export function getTimeStatus(startTime: string, endTime: string, now: Date = new Date()): '未开始' | '进行中' | '已结束' {
  // 将 "YYYY-MM-DD HH:mm:ss" 转为标准 ISO 格式（浏览器安全）
  const parseDate = (str: string) => new Date(str.replace(' ', 'T'))

  const start = parseDate(startTime)
  const end = parseDate(endTime)

  if (now < start)
    return '未开始'
  if (now > end)
    return '已结束'
  return '进行中'
}
