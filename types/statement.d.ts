/**
 * 销售明细Where
 */
interface StatementWhere {
  code?: string
  end_date?: string
  id?: string
  member_id?: string
  order_id?: string
  start_date?: string
  status?: number
  store_id?: string
  type?: number
  showtype?: 'list' | 'table'
  searchPage?: number
  limits?: number
}

/*
 * 退货明细where
 */
interface StatementRefundWhere {
  code?: string
  end_date?: string
  id?: string
  member_id?: string
  name?: string
  order_id?: string
  start_date?: string
  store_id?: string
  showtype?: 'list' | 'table'
  searchPage?: number
  limits?: number
}
interface StatementRefundInfo {
  code: string
  created_at: string
  id: string
  ip: string
  member: Member
  member_id: string
  name: string
  operator: any
  operator_id: string
  order_id: string
  order_type: number
  price: string
  price_original: string
  quantity: number
  remark: string
  store: Stores
  store_id: string
  type: number
  updated_at: string
}

interface PrintSattementTotalReq {
  start_time?: string
  end_time?: string
  store_id?: string
  salesman_id?: string
}

interface StatisticSalesDetailDailyResp {
  /**
   * 汇总项
   */
  summary: StatisticSalesDetailDailySummary
  /**
   * 分项
   */
  itemized: StatisticSalesDetailDailyItemized
  /**
   * 支付项
   */
  payment: StatisticSalesDetailDailyPayment[]
  payment_total: StatisticSalesDetailDailyPayment
  finished_sales: {
    [key]: {
      [key]: PrintFinishedSalesItem
    }
  }
  accessorie_sales: {
    [key ]: {
      /**
       * 单价
       */
      price: string
      /**
       * 实收
       */
      received: string
      /**
       * 应收
       */
      receivable: string
      /**
       * 数量
       */
      quantity: number
    }
  }
  accessorie_sales_refund: {
    [key ]: {
      /**
       * 数量
       */
      quantity: 数量
      /**
       * 退款
       */
      refunded: string
    }
  }
  old_sales: {
    [key as string]: oldSalesClass[]
  }
  old_sales_refund: {
    [key as string]: oldSalesClass[]
  }
  finished_sales_refund: {
    [key]: {
      [key]: finished_sales_refundItem
    }
  }
}
interface finished_sales_refundItem {
  labor_fee: string
  price: string
  quantity: number
  refunded: string
  weight_metal: string
}
interface oldSalesClass {
  /**
   * 名称
   */
  name: string
  /**
   * 抵值
   */
  deduction: string
  /**
   * 金重
   */
  weight_metal: string
  /**
   * 主石重
   */
  weight_gem: string
  /**
   * 件数
   */
  quantity: number
  /**
   * 标签价
   */
  label_price: string
  /**
   * 工费
   */
  labor_fee: string
  /**
   * 转成品抵值
   */
  to_finished_deduction: string
  /**
   * 转成品金重
   */
  to_finished_weight_metal?: string
  /**
   * 剩余金重
   */
  surplus_weight?: string
  /**
   * 转成品件数
   */
  to_finished_quantity?: string
  /**
   * 剩余主石重
   */
  surplus_weight_gem?: string
  /**
   *条码
   */
  code?: string
  /**
   * 退货金额
   */
  refunded?: string
}
interface StatisticSalesDetailDailySummary {
  /**
   * 销售应收
   */
  sales_receivable: string
  /**
   * 销售退款
   */
  sales_refund: string
  /**
   * 销售实收
   */
  sales_received: string
  /**
   * 其他收入
   */
  other_income: string
  /**
   * 其他支出
   */
  other_expense: string
  /**
   * 定金收入
   */
  deposit_income: string
  /**
   * 定金退款
   */
  deposit_refund: string
}

interface StatisticSalesDetailDailyItemized {
  /** 成品应收 */
  finished_receivable: string
  /** 成品件数 */
  finished_quantity: number
  /** 定金抵扣 */
  deposit_deduction: string
  /** 旧料抵扣 */
  old_deduction: string
  /** 旧料件数 */
  old_quantity: string
  /** 旧料金重 */
  old_weight_metal: string
  /** 旧料转成品件数 */
  old_to_finished_quantity: string
  /** 旧料转成品抵扣 */
  old_to_finished_deduction: string
  /** 旧料转成品重量 */
  old_to_finished_weight_metal: string
  /** 配件金额 */
  accessorie_price: string
  /** 配件件数 */
  accessorie_quantity: number
}

interface StatisticSalesDetailDailyPayment {
  /** 名称 */
  name: string
  /** 收入 */
  income: string
  /** 支出 */
  expense: string
  /** 实收 */
  received: string
}

// 定义成品销售数据的item类型
interface PrintFinishedSalesItem {
  labor_fee: string
  price: string
  receivable: string
  weight_metal: string
  quantity: number
}

// 定义汇总统计行的数据类型
interface PrintSummaryRow<T> {
  firstKey: string
  secondKey: string
  item: T
  index: number
}
