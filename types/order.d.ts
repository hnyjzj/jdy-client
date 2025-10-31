/**
 * 新增销售单
 */
interface Orders {
  /**
   * 收银员ID
   */
  cashier_id?: string
  cashier?: Staff
  clerks: OrderSalesClerks[]
  /**
   * 整单折扣
   */
  discount_rate?: number
  /**
   * 是否积分
   */
  has_integral: boolean
  /**
   * 积分抵扣
   */
  integral_deduction?: number
  /**
   * 会员ID
   */
  member_id?: string
  member?: Member
  /**
   * 定金单 ID
   */
  order_deposit_ids?: string[]
  /**
   * 支付方式
   */
  payments: Payment[]
  /**
   * 配件
   */
  product_accessories?: {
    product_id?: string
    quantity?: number
    price?: number
    integral?: number
  }[]
  /**
   * 成品
   */
  product_finisheds?: OrderProductFinished[]
  /**
   * 旧料
   */
  product_olds?: OrderMaterial[]
  /**
   * 订单备注
   */
  remarks: string[]
  /**
   * 抹零
   */
  round_off?: number
  /**
   * 订单来源
   */
  source: number
  /**
   * 门店ID
   */
  store_id: string
  /**
   * 展示的成品列表
   */
  showProductList?: OrderProductFinished[]
  showMasterialsList?: OrderMaterial[]
  showPartsList?: OrderPart[]

  userRemark: string
}

/**
 * OrderSalesClerks
 */
interface OrderSalesClerks {
  /**
   * 创建时间
   */
  created_at?: Date
  /**
   * 删除时间
   */
  deleted_at?: Date
  /**
   * ID
   */
  id?: string
  /**
   * 是否主导购员
   */
  is_main: boolean
  /**
   * 销售单ID
   */
  order_id?: string
  /**
   * 业绩金额
   */
  performance_amount?: number | string
  /**
   * 业绩比例
   */
  performance_rate: number
  /**
   * 导购员ID
   */
  salesman_id?: string
  /**
   * 更新时间
   */
  updated_at?: Date

  salesman?: Staff

  nickname?: string
}

interface Payment {
  /**
   * 金额
   */
  amount?: number
  /**
   * 支付方式
   */
  payment_method: number

}

interface OrderProductFinished extends ProductFinisheds {
  /**
   * 折扣(显示)
   */
  discount_final?: number
  /**
   * 固定折扣
   */
  discount_fixed?: number
  /**
   * 会员折扣
   */
  discount_member?: number
  /**
   * 积分
   */
  integral?: number
  /**
   * 积分抵扣
   */
  integral_deduction?: number
  /**
   * 工费
   */
  labor_fee: number
  /**
   * 应付金额
   */
  price?: number
  /**
   * 金价
   */
  price_gold?: number
  /**
   * 原价
   */
  price_original?: number
  /**
   * 产品ID
   */
  product_id?: string
  /**
   * 抹零
   */
  round_off?: number
  /**
   *积分比例
   */
  rate?: number
  //   /**
  //    *成品信息
  //    */
  product?: ProductFinisheds

}
interface OrderMaterial extends ProductFinisheds {
  product_id?: string
  integral?: number
  product?: ProductOlds
  recycle_method?: number
  quality_actual?: number
  recycle_price?: number
  recycle_price_gold?: number
  recycle_price_labor?: number
  recycle_price_labor_method?: number
  recycle_type?: number
  is_our?: boolean
  code_finished?: string
}
interface OrderPart extends ProductAccessories {
  /**
   * 积分
   */
  integral?: number
  /**
   * 应付金额
   */
  price?: number
  /**
   * 产品ID
   */
  product_id?: string
  /**
   * 数量
   */
  quantity?: number
  /**
   * 单价
   */
  one_price?: number
  status?: number
  id: string
  product?: ProductAccessories
  price_original?: string
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
  payment_method?: any[]
  showtype?: 'list' | 'table'
  searchPage?: number
  limits?: number
}
/**
 * 退货成品
 */
interface ReturnGoods {
  /**
   * 订单 ID
   */
  id: string
  /**
   * 退货入库方式，成品类型必传
   */
  method?: number
  /**
   * 支付方式
   */
  payments: Payment[]
  /**
   * 退款金额
   */
  price: number
  /**
   * 商品ID
   */
  product_id: string
  /**
   * 货品类型
   */
  product_type: number
  /**
   * 备注
   */
  remark: string
}
/**
 * 销售单详情
 */
interface OrderInfo extends Orders {
  /**
   * 门店信息
   */
  store: Stores
  /**
   * id
   */
  id: string
  /**
   * 会员信息
   */
  member: Member
  /**
   * 收银员信息
   */
  cashier: any
  /**
   * 状态
   */
  status: number
  /**
   * 应付金额
   */
  price: string
  /**
   * 金额折扣
   */
  price_discount: string
  /**
   * 原始价格
   */
  price_original: string

  /**
   * 积分
   */
  integral: string

  /**
   * 实付金额
   */
  price_pay: string
  /**
   * 创建时间
   */
  created_at: string

  /**
   *成品货品金额
   */
  product_finished_price: string
  /**
   *配件礼品金额
   */
  product_accessorie_price: string
  /**
   *旧料抵扣金额
   */
  product_old_price: string

  order_deposits: DepositOrderInfo[]

  products: orderInfoProducts[]
  operator_id: string
}

interface orderInfoProducts {
  code?: string
  member?: Member
  accessorie: OrderPart
  created_at: string
  finished: OrderProductFinished
  id: string
  old: OrderMaterial
  order: OrderInfo
  order_id: string
  status: number
  store: Stores
  store_id: string
  type: number
  updated_at: string
  name?: string
}
