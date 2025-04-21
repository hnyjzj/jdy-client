interface BillingSet {
  /**
   * "金额进位控制"
   */
  rounding: number
  /**
   *"金额小数点控制"
   */
  decimal_point: number
  /**
   *积分抵扣比例
   */
  discount_rate: string
  /**
   * 门店id
   */
  store_id?: string
  /**
   * "是否弹窗二次确认"
   */
  use_confirm: boolean
}
