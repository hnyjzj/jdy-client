/**
+ * 对手机号码进行脱敏处理
+ * @param number 需要脱敏的手机号码
+ * @returns 脱敏后的手机号码，格式：前3位 + **** + 后4位
 */
export const newPhone = (number: string) => {
  if (!number || typeof number !== 'string') {
    return ''
  }

  // 移除所有非数字字符
  const cleanNumber = number.replace(/\D/g, '')

  // 检查号码长度是否至少有8位
  if (cleanNumber.length < 8) {
    return ''
  }

  const prefix = cleanNumber.slice(0, 3)
  const suffix = cleanNumber.slice(-4)

  return `${prefix}****${suffix}`
}
