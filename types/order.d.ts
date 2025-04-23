/**
 * Orders
 */
interface Orders {
  /**
   * 收银员ID
   */
  cashier_id?: string
  clerks: OrderSalesClerks[]
  /**
   * 整单折扣
   */
  discount_rate: number
  /**
   * 是否积分
   */
  has_integral: boolean
  /**
   * 积分抵扣
   */
  integral_deduction: number
  /**
   * 会员ID
   */
  member_id?: string
  /**
   * 定金单 ID
   */
  order_deposit_ids: string[]
  /**
   * 支付方式
   */
  payments: Payment[]
  /**
   * 配件
   */
  product_accessorie: ProductAccessorie[]
  /**
   * 成品
   */
  product_finished: ProductFinished[]
  /**
   * 旧料
   */
  product_old: ProductOld[]
  /**
   * 订单备注
   */
  remark?: string
  /**
   * 抹零
   */
  round_off: number | string
  /**
   * 订单来源
   */
  source: number
  /**
   * 门店ID
   */
  store_id?: string
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

}

interface Payment {
  /**
   * 金额
   */
  amount: number
  /**
   * 支付方式
   */
  payment_method?: number

}

interface ProductAccessorie {
  /**
   * 积分
   */
  integral?: number | string
  /**
   * 应付金额
   */
  price?: number | string
  /**
   * 产品ID
   */
  product_id: string
  /**
   * 数量
   */
  quantity: number

}

interface ProductFinished {
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
  labor_fee?: number
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
  product_id: string
  /**
   * 抹零
   */
  round_off?: number
  /**
   *积分比例
   */
  rate: number
  /**
   *成品信息
   */
  product?: ProductFinisheds
}

interface ProductOld {
  /**
   * 品牌
   */
  brand?: number
  /**
   * 品类
   */
  category?: number
  /**
   * 主石净度
   */
  clarity?: number
  /**
   * 条码
   */
  code?: string
  /**
   * 主石色
   */
  color_gem?: number
  /**
   * 工艺
   */
  craft?: number
  /**
   * 主石切工
   */
  cut?: number
  /**
   * 主石
   */
  gem?: number
  /**
   * 积分
   */
  integral?: number
  /**
   * 是否本司货品
   */
  is_our?: boolean
  /**
   * 标签价
   */
  label_price?: string
  /**
   * 材质
   */
  material?: number
  /**
   * 名称
   */
  name?: string
  /**
   * 主石数
   */
  num_gem?: number
  /**
   * 杂料数
   */
  num_other?: number
  /**
   * 产品ID
   */
  product_id?: string
  /**
   * 成色
   */
  quality?: number
  /**
   * 实际成色
   */
  quality_actual?: string
  /**
   * 回收方式
   */
  recycle_method?: number
  /**
   * 回收金额
   */
  recycle_price: number
  /**
   * 回收金价
   */
  recycle_price_gold?: number
  /**
   * 回收工费
   */
  recycle_price_labor?: number
  /**
   * 回收工费方式
   */
  recycle_price_labor_method?: number
  /**
   * 回收类型
   */
  recycle_type?: number
  /**
   * 主石重
   */
  weight_gem?: number
  /**
   * 金重
   */
  weight_metal?: number
  /**
   * 杂料重
   */
  weight_other?: number
  /**
   * 总重
   */
  weight_total?: number
  /**
   * 积分比例
   */
  rate: string | number

  class: number
  /**
   * 产品类型
   */
  type: number
}

interface OrderProducts {

  /**
   * 工费
   */
  labor_fee?: number
  /**
   * 应付金额
   */
  amount: number
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
  product?: ProductFinisheds
  /**
   * 数量，默认 为1
   */
  quantity?: number
  /**
   * 更新时间
   */
  updated_at?: Date
  /**
   * 抹零金额
   */
  notCount: number
  /**
   * 显示折扣
   */
  show_discount?: number
  /**
   * 原始价格 用于计算折扣
   */
  orign: number

  /**
   * 折扣
   */
  member_discount?: number

  /**
   * 卡券抵扣
   */
  cardDeduction: number
  /**
   * 积分抵扣
   */
  scoreDeduction: number
  /**
   * 积分比例
   */
  rate: number

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
  payment_method?: OrderPaymentMethod[]
}

// 定金单
interface DepositOrderProducts {

  /**
   * 工费
   */
  labor_fee?: number
  /**
   * 应付金额
   */
  amount: number
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
  product?: ProductFinisheds
  /**
   * 数量，默认 为1
   */
  quantity?: number
  /**
   * 更新时间
   */
  updated_at?: Date
  /**
   * 抹零金额
   */
  notCount: number
  /**
   * 显示折扣
   */
  show_discount?: number
  /**
   * 原始价格 用于计算折扣
   */
  orign: number

  /**
   * 折扣
   */
  member_discount?: number

  /**
   * 卡券抵扣
   */
  cardDeduction: number
  /**
   * 积分抵扣
   */
  scoreDeduction: number
  /**
   * 积分比例
   */
  rate: number

  /**
   * 订金金额
   */
  deposit_amount?: number
}
