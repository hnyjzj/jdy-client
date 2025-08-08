export const returnType = (number: number) => {
  if (number === OrderProductType.Finished) {
    return '成品'
  }
  if (number === OrderProductType.OldMaterial) {
    return '旧料'
  }
  if (number === OrderProductType.Parts) {
    return '配件'
  }
  return ''
}
