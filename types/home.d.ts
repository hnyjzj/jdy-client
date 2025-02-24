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
