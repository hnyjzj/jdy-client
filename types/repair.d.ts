// 创建维修单
interface serviceOrederCreate {
  /**
   * 地址
   */
  address?: string
  /**
   * 区
   */
  area?: string
  /**
   * 市
   */
  city?: string
  /**
   * 维修成本
   */
  cost?: number
  /**
   * 取货方式
   */
  delivery_method?: number
  /**
   * 描述
   */
  desc?: string
  /**
   * 维修费
   */
  expense?: number
  /**
   * 图片
   */
  images?: string[]
  /**
   * 会员ID
   */
  member_id?: string
  /**
   * 维修项目
   */
  name?: string
  /**
   * 省
   */
  province?: string
  /**
   * 接待人ID
   */
  receptionist_id?: string
  /**
   * 门店ID
   */
  store_id?: string

  payments?: Payment[]
  products?: ProductFinished[]

  cashier_id?: string
}
/**
 * 维修订单Where
 */
interface service {
  address?: string
  area?: string
  city?: string
  delivery_method?: number
  desc?: string
  end_date?: string
  id?: string
  images?: string[]
  member_id?: string
  name?: string
  payment_method?: string
  province?: string
  receptionist_id?: string
  start_date?: string
  status?: string
  store_id?: string
}

interface serviceGoods {

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
  clarity_gem?: number

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
   * 主石
   */
  gem?: number

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
   * 成色
   */
  quality?: number
  /**
   * 备注
   */
  remark?: string

  /**
   * 主石重
   */
  weight_gem?: number
  /**
   * 金重
   */
  weight_metal?: number

  /**
   * 总重
   */
  weight_total?: number
  /**
   * 主石切工
   */
  cut?: number
  /**
   * 是否本公司
   */
  is_our?: boolean

}

/**
 * 维修单详情
 */

interface ServiceOrderInfo {
  /**
   * 地址
   */
  address?: string
  /**
   * 区
   */
  area?: string
  /**
   * 市
   */
  city?: string
  /**
   * 维修成本
   */
  cost?: number | string
  /**
   * 创建时间
   */
  created_at?: string
  /**
   * 删除时间
   */
  deleted_at?: string
  /**
   * 取货方式
   */
  delivery_method?: number
  /**
   * 描述
   */
  desc?: string
  /**
   * 维修费
   */
  expense?: number | string
  /**
   * ID
   */
  id: string
  /**
   * 图片
   */
  images?: string[]
  /**
   * IP地址
   */
  ip?: string
  /**
   * 会员ID
   */
  member_id?: string
  /**
   * 维修项目
   */
  name?: string
  /**
   * 操作员ID
   */
  operator_id?: string
  products?: OrderRepairProducts[]
  /**
   * 省
   */
  province?: string
  /**
   * 接待人ID
   */
  receptionist_id?: string
  /**
   * 订单状态
   */
  status: number
  /**
   * 门店ID
   */
  store_id?: string
  /**
   * 更新时间
   */
  updated_at?: string

  store?: Stores

  member?: Member

  operator?: Staff

  cashier_id?: string
}

/**
 * 维修单货品类型
 */
interface OrderRepairProducts {
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
   * 颜色
   */
  color_gem?: number
  /**
   * 工艺
   */
  craft?: number
  /**
   * 创建时间
   */
  created_at?: Date
  /**
   * 主石切工
   */
  cut?: number
  /**
   * 删除时间
   */
  deleted_at?: Date
  /**
   * 主石
   */
  gem?: number
  /**
   * ID
   */
  id?: string
  /**
   * 是否本店商品
   */
  is_our?: boolean
  /**
   * 标签价
   */
  label_price?: number | string
  /**
   * 材质
   */
  material?: number
  /**
   * 名称
   */
  name?: string
  /**
   * 订单ID
   */
  order_id?: string
  /**
   * 商品ID
   */
  product_id?: string
  /**
   * 成色
   */
  quality?: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 状态
   */
  status?: number
  /**
   * 更新时间
   */
  updated_at?: Date
  /**
   * 主石重
   */
  weight_gem?: number | string
  /**
   * 金重
   */
  weight_metal?: number | string
  /**
   * 总重
   */
  weight_total?: number | string

}

/**
 * 更新维修单参数
 *
 */
interface updateRepairParams {
  /**
   * 地址
   */
  address?: string
  /**
   * 区
   */
  area?: string
  /**
   * 市
   */
  city?: string
  /**
   * 取货方式
   */
  delivery_method?: number
  /**
   * 描述
   */
  desc?: string
  /**
   * ID
   */
  id?: string
  /**
   * 图片
   */
  images?: string[]
  /**
   * 维修项目
   */
  name?: string
  /**
   * 省
   */
  province?: string
}
