export const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  // 使用正则表达式过滤非数字字符
  const text = target.value.replace(/\D/g, '')
  return text
}
