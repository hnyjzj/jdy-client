// 获取今日开始和结束时间，格式为'yyyy-MM-ddTHH:mm:ss.SSSxxx'
export function getTodayRange(): { start: string, end: string } {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const year = now.getFullYear()
  const month = pad(now.getMonth() + 1)
  const day = pad(now.getDate())
  // 构造今日0点
  const start = new Date(`${year}-${month}-${day}T00:00:00.000${getTimezoneOffsetString(now)}`)
  // 构造今日23:59:59
  const end = new Date(`${year}-${month}-${day}T23:59:59.000${getTimezoneOffsetString(now)}`)
  return {
    start: formatDate(start),
    end: formatDate(end),
  }
}

function formatDate(date: Date): string {
  // yyyy-MM-ddTHH:mm:ss.SSSxxx
  const pad = (n: number, len = 2) => n.toString().padStart(len, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const h = pad(date.getHours())
  const min = pad(date.getMinutes())
  const s = pad(date.getSeconds())
  const ms = pad(date.getMilliseconds(), 3)
  const tz = getTimezoneOffsetString(date)
  return `${y}-${m}-${d}T${h}:${min}:${s}.${ms}${tz}`
}

function getTimezoneOffsetString(date: Date): string {
  const offset = -date.getTimezoneOffset() // 以分钟为单位，东八区为480
  const sign = offset >= 0 ? '+' : '-'
  const absOffset = Math.abs(offset)
  const hours = Math.floor(absOffset / 60)
  const minutes = absOffset % 60
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
// 将'2025-08-21T16:16:23.000+08:00'格式转为'YYYY-MM-DD hh:mm:ss'
export function formatIsoToDateTime(str: string): string {
  if (!str)
    return ''
  const d = new Date(str)
  const pad = (n: number) => n.toString().padStart(2, '0')
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hour = pad(d.getHours())
  const min = pad(d.getMinutes())
  const sec = pad(d.getSeconds())
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`
}
