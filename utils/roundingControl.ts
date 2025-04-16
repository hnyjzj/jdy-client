// 小数点进位计算函数
export const holdFunction = (num: number) => {
  if (num) {
    return Number(num) - 1
  }
  else {
    return 0
  }
}

// 取整控制函数
export const roundFunction = (num: number) => {
  if (num === 1) {
    // 四舍五入
    return '5'
  }
  if (num === 2) {
    // 向下取整
    return '-'
  }
  if (num === 3) {
    //  向上取整
    return '+'
  }
  return '5'
}
