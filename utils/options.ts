interface SaleItemsPreset {
  [key: string | number]: string
}
interface options {
  label: string
  value: number
}

enum SaleRealtype {
  piecework = 1,
  AccordingToGrams,
  byThePrice,
}

/**
 * 将后端选项参数转换为前端下拉框选项
 *
 * @param obj Object
 * @returns  Array
 */
export const optonsToSelect = (obj: SaleItemsPreset, hasZero = false) => {
  const list = ref<options[]>([])
  Object.keys(obj).filter((key) => {
    if (hasZero) {
      return true
    }
    else {
      return Number(key) !== 0
    }
  }).forEach((key) => {
    list.value.push({
      label: obj[key],
      value: Number(key),
    })
  })
  return list.value
}

/**
 * 根据输入的数字值返回对应的类型描述
 * @param val 可选的数字参数，用于判断返回哪种类型描述
 * @returns 返回对应的类型字符串描述
 */
export const realtype = (val?: number) => {
  switch (val) { // 使用switch语句根据输入值进行判断
    case SaleRealtype.piecework: // 当值为1时，返回'计件'
      return '计件'
    case SaleRealtype.AccordingToGrams: // 当值为2时，返回'计重工费按克'
      return '计重工费按克'
    case SaleRealtype.byThePrice: // 当值为3时，返回'计重工费按件'
      return '计重工费按件'
  }
}
