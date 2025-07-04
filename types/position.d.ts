interface Position {
  // 距离单位为 xxxxx
  top: number
  bottom: number
  left: number
  right: number
  topDistance: number
  bottomDistance: number
  leftDistance: number
  rightDistance: number
}

/**
 * 模板类型
 */
enum TemplateType {
  /**
   * 销售模板
   */
  SalesTemp = 1,
  /**
   * 退货模板
   */
  ReturnTemp = 2,
  /**
   * 其他模板
   */
  OtherTemp = 3,
}
