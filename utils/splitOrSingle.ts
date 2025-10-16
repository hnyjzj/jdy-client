/**
 * 将输入字符串按指定分隔符拆分成数组，如果不包含分隔符则返回单元素数组。
 * 支持非字符串输入（自动转换为字符串），并去除前后空格和空项。
 *
 * @param str 输入值（字符串、数字或其他类型，会转换为字符串）
 * @param separator 分隔符（默认 '、'）
 * @returns 拆分后的字符串数组（去除空项和空格）
 */
export function splitOrSingle(str: any, separator: string = '、'): string[] {
  if (!str) {
    return []
  }

  const trimmed = String(str).trim()
  if (trimmed.includes(separator)) {
    return trimmed.split(separator)
      .map((item: string) => item.trim())
      .filter((item: string) => item !== '')
  }
  else {
    return trimmed ? [trimmed] : []
  }
}
