export const unit = (value: string) => {
  if (value.includes('件数')) {
    return '件'
  }
  if (value.includes('单数')) {
    return '单'
  }
  if (value.includes('金额')) {
    return '元'
  }
  if (value.includes('抵值')) {
    return '元'
  }
  if (value.includes('标签价')) {
    return '元'
  }
  if (value.includes('笔数')) {
    return '笔'
  }
  if (value.includes('金重')) {
    return '克'
  }
}
