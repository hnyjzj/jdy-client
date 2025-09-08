interface CashflowWhere {
  store_id?: string
  duration?: number
  endTime?: string
  startTime?: string
}

/**
 * 现金流项目数据接口
 */
type CashflowItem = Record<string, string>

/**
 * 现金流列表数据类型
 * 使用 Record 类型映射支付方式到现金流数据
 */
type CashflowList = Record<string, CashflowItem>
