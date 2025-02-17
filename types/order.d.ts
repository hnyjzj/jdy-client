/**
 * Orders
 */
interface Orders {
  /**
   * 应付金额
   */
  amount?: number
  /**
   * 原价
   */
  amount_original?: number
  /**
   * 实付金额
   */
  amount_pay?: number
  /**
   * 抹零金额
   */
  amount_reduce: number
  /**
   * 收银员ID
   */
  cashier_id?: string
  /**
   * 收银员信息
   */
  cashier?: Staff
  /**
   * 创建时间
   */
  created_at?: Date
  /**
   * 删除时间
   */
  deleted_at?: Date
  /**
   * 整单折扣金额
   */
  discount_amount?: number
  /**
   * 整单折扣
   */
  discount_rate?: number
  /**
   * 订单编号
   */
  id?: string
  /**
   * 赠送积分
   */
  integral_present?: number
  /**
   * 使用积分
   */
  integral_use: number
  /**
   * 会员ID
   */
  member_id?: string
  /**
   * 会员信息
   */
  member?: Member
  /**
   * 订单备注
   */
  remark: string
  /**
   * 订单来源
   */
  source?: OrderSource
  /**
   * 订单状态
   */
  status?: OrderStatus
  /**
   * 门店ID
   */
  store_id: string
  /**
   * 门店信息
   */
  store?: Store
  /**
   * 订单类型
   */
  type?: OrderType
  /**
   * 更新时间
   */
  updated_at?: Date
  /**
   * 导购员列表
   */
  salesmans: OrderSalesmen[]
  /**
   * 商品列表
   */
  products: OrderProduct[]
}
interface OrderSalesmen {
  /**
   * 创建时间
   */
  created_at?: Date
  /**
   * ID
   */
  id?: string
  /**
   * 是否主导购员，默认为 false
   */
  is_main?: boolean
  /**
   * 订单ID
   */
  order_id?: string
  /**
   * 业绩金额
   */
  performance_amount?: number
  /**
   * 业绩比例
   */
  performance_rate?: number
  /**
   * 导购员ID
   */
  salesman_id?: string
  /**
   * 导购员信息
   */
  salesman?: Staff
  /**
   * 更新时间
   */
  updated_at?: Date
}
interface OrderProducts {
  /**
   * 应付金额
   */
  amount?: number
  /**
   * 原价
   */
  amount_original?: number
  /**
   * 创建时间
   */
  created_at?: Date
  /**
   * 折扣
   */
  discount?: number
  /**
   * 折扣金额
   */
  discount_amount?: number
  /**
   * ID
   */
  id?: string
  /**
   * 增加积分
   */
  integral?: number
  /**
   * 订单ID
   */
  order_id?: string
  /**
   * 单价
   */
  price?: number
  /**
   * 产品ID
   */
  product_id: string
  /**
   * 产品信息
   */
  product?: Product
  /**
   * 数量，默认 为1
   */
  quantity?: number
  /**
   * 更新时间
   */
  updated_at?: Date
}

interface OrderWhere {
  cashier_id?: string
  end_date?: string
  id?: string
  member_id?: string
  salesman_id?: string
  source?: number
  start_date?: string
  status?: number
  store_id?: string
  product_id?: string
  type?: number
}
