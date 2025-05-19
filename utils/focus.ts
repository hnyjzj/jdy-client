export default (e: FocusEvent) => {
  // 让页面滚动到输入框的位置
  e?.target instanceof HTMLElement && e.target.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' })
}
