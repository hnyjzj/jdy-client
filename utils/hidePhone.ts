export const newPhone = (number: string) => {
  // 获取电话号码的前三位和后四位
  const part1 = number.substring(0, 3)
  const part2 = number.substring(7)
  // 构造中间部分，用星号替代
  const stars = '****'
  // 将各部分合并成新的字符串
  return part1 ? part1 + stars + part2 : ''
}
