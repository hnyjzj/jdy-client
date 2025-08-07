/**
 * 新增销售单
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
  product_accessories?: {
    product_id: string
    quantity?: number
    price?: number
    integral?: number
  }[]
  /**
   * 成品
   */
  product_finisheds?: ProductFinished[]
  /**
   * 旧料
   */
  product_olds?: ProductOld[]
  /**
   * 订单备注
   */
  remarks?: string[]
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

  product: ProductAccessories
  status?: number
  id?: string
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
  product_id?: string
  /**
   * 抹零
   */
  round_off?: number
  /**
   *积分比例
   */
  rate?: number
  /**
   *成品信息
   */
  product?: ProductFinisheds
  weight_gem?: number
  retail_type?: number
  label_price?: string
  weight_metal?: number
  color_gem?: number
  clarity?: number
  name?: string
  code?: string
  status?: number
  id?: string
  finisheds?: ProductFinisheds
}

interface ProductOld {
  /**
   * 品牌
   */
  brand: number
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
  is_our: boolean
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
  quality: number
  /**
   * 实际成色
   */
  quality_actual?: number
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
  status?: number
  product?: ProductOlds
  id?: string
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

}

interface orderInfoProducts {
  code?: string
  member?: Member
  accessorie: ProductAccessorie
  created_at: string
  finished: ProductFinished
  id: string
  old: ProductOld
  order: OrderInfo
  order_id: string
  status: number
  store: Stores
  store_id: string
  type: number
  updated_at: string
  name?: string
}
