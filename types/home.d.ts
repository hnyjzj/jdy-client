interface StorePerformance {
  /**
   * 足金（件）
   */
  gold: number | string
  /**
   * 足金件兑换旧料抵扣
   */
  gold_deduction: number | string
  /**
   * 足金克
   */
  gold_weight: number | string
  /**
   * 足金克兑换旧料抵扣
   */
  gold_weight_deduction: number | string
  /**
   * 店名
   */
  name: string
  /**
   * 计件配件
   */
  piece_accessories: number | string
  /**
   * 银饰
   */
  silver: number | string
  /**
   * 总业绩
   */
  total: number | string
}

interface todaySales {
  /**
   * 今日金价
   */
  gold_price: string
  /**
   * 旧货抵值
   */
  old_goods_amount: string
  /**
   * 退货金额
   */
  return_amount: string
  /**
   * 销售金额
   */
  sales_amount: string
  /**
   * 销售件数
   */
  sales_count: number
}
