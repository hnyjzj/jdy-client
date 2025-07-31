/**
 * 新增收支单参数
 */
interface otherOrderCreate {
  /**
   * 订单金额
   */
  amount?: number | string
  /**
   * 导购员ID
   */
  clerk_id?: string
  /**
   * 订单内容
   */
  content?: string
  /**
   * 会员ID
   */
  member_id?: string
  /**
   * 销售单ID
   */
  order_id?: string
  payments: Payment[]
  /**
   * 订单来源
   */
  source?: number
  /**
   * 门店ID
   */
  store_id?: string
  /**
   * 订单类型
   */
  type?: number
  id?: string

}

/**
 * 收支单筛选条件 where
 */

interface otherOrderWhere {
  amount?: string
  clerk_id?: string
  content?: string
  end_date?: string
  id?: string
  member_id?: string
  order_id?: string
  source?: number
  start_date?: string
  store_id?: Stores['id']
  type?: number
  showtype?: 'list' | 'table'
  searchPage?: number
  limits?: number
}

/**
 * 收支单详情
 */

interface otherOrderInfo {
  amount: string
  clerk: Staff
  clerk_id: string
  content: string
  created_at: string
  id: string
  ip: string
  member: Member
  member_id: string
  operator: Staff
  operator_id: string
  order: Orders
  order_id: string
  payments: Payment[]
  source: number
  store: Stores
  store_id: string
  type: number
  updated_at: string
}
