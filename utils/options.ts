interface SaleItemsPreset {
  [key: string | number]: string
}
interface options {
  label: string
  value: number
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
