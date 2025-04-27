interface DepositOrder {
  /**
   * 收银员ID
   */
  cashier_id?: string
  /**
   * 导购员ID
   */
  clerk_id?: string
  /**
   * 会员ID
   */
  member_id?: string
  payments: DepositOrderPayment[]
  /**
   * 应付金额
   */
  price?: number | string
  /**
   * 实付金额
   */
  price_pay?: number | string
  products: DepositOrderProduct[]
  /**
   * 订单备注
   */
  remark?: string
  /**
   * 订单状态
   */
  status?: number
  /**
   * 门店ID
   */
  store_id?: string

}

interface DepositOrderPayment {
  /**
   * 金额
   */
  amount?: number
  /**
   * 支付方式
   */
  payment_method?: number

}
/**
 * 提交定金单成品列表
 */
interface DepositOrderProduct {
  /**
   * 是否我司产品
   */
  is_our?: boolean
  /**
   * 应付金额
   */
  price?: number
  /**
   * 金价
   */
  price_gold?: number
  /**
   * 成品ID
   */
  product_id?: string

  product?: ProductFinisheds
  /**
   * 商品名称
   */
  name?: string
  /**
   * 标签价
   */
  label_price?: number
  /**
   *金重
   */
  weight_metal?: number
  /**
   *工费
   */
  labor_fee?: number
  /**
   *零售方式
   */
  retail_type?: number
  /**
   *主石重
   */
  weight_gem?: number
  /**
   *主石颜色
   */
  color_gem?: number
  /**
   *主石净度
   */
  clarity_gem?: number

}

/**
 * 定金单详情
 */
interface DepositOrderInfo {
  cashier?: Staff
  /**
   * 收银员ID
   */
  cashier_id?: string
  clerk?: Staff
  /**
   * 导购员ID
   */
  clerk_id?: string
  /**
   * 创建时间
   */
  created_at: string
  /**
   * 删除时间
   */
  deleted_at?: string
  /**
   * ID
   */
  id?: string
  /**
   * IP地址
   */
  ip?: string
  member?: Member
  /**
   * 会员ID
   */
  member_id?: string
  operator?: Staff
  /**
   * 操作员ID
   */
  operator_id?: string
  /**
   * 应付金额
   */
  price?: number | string
  /**
   * 实付金额
   */
  price_pay?: number | string
  /**
   * 订单备注
   */
  remark?: string
  /**
   * 订单状态
   */
  status?: number
  store?: Stores
  /**
   * 门店ID
   */
  store_id?: string
  /**
   * 更新时间
   */
  updated_at?: Date

  payments?: DepositOrderPayment[]

  products: DepositOrderInfoProducts[]

  order_sales: ProductFinisheds[]
}
/**
 * 定金单详情的产品
 */
interface DepositOrderInfoProducts {
  /**
   * 创建时间
   */
  created_at?: string
  /**
   * ID
   */
  id?: string
  /**
   * 是否我司产品
   */
  is_our?: boolean
  order?: OrderDeposits
  /**
   * 定金单ID
   */
  order_id?: string
  /**
   * 应付金额
   */
  price?: number | string
  /**
   * 金价
   */
  price_gold?: number | string
  /**
   * 手动添加
   */
  product_demand?: ProductFinisheds
  /**
   * 成品
   */
  product_finished: ProductFinisheds
  /**
   * 成品ID
   */
  product_id?: string
  /**
   * 状态
   */
  status?: number
  /**
   * 更新时间
   */
  updated_at?: string

}
