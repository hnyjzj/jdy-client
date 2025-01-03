// 产品类型
interface Product {
  id: string
  /**
   * 入网费
   */
  access_fee: number
  /**
   * 品牌
   */
  brand: number
  /**
   * 品类
   */
  category: number
  /**
   * 证书
   */
  certificate: string[]
  /**
   * 净度
   */
  clarity: number
  /**
   * 大类
   */
  class: number
  /**
   * 条码
   */
  code: string
  /**
   * 颜色
   */
  color: number
  /**
   * 主石色
   */
  color_gem: number
  /**
   * 工艺
   */
  craft: number
  /**
   * 宝石
   */
  gem: number
  /**
   * 是否特价
   */
  is_special_offer: boolean
  /**
   * 工费
   */
  labor_fee: number
  /**
   * 材质
   */
  material: number
  /**
   * 名称
   */
  name: string
  /**
   * 主石数
   */
  num_gem: number
  /**
   * 杂料重
   */
  num_other: number
  /**
   * 价格
   */
  price: number
  /**
   * 产品入库单ID
   */
  product_enter_id: string
  /**
   * 成色
   */
  quality: number
  /**
   * 备注
   */
  remark: string
  /**
   * 零售类型
   */
  retail_type: number
  /**
   * 手寸
   */
  size: number
  /**
   * 状态
   */
  status: 1 | 2 | 3
  /**
   * 款式
   */
  style: style
  /**
   * 供应商
   */
  supplier: number
  /**
   * 总重量
   */
  weight: number
  /**
   * 主石重
   */
  weight_gem: number
  /**
   * 金重
   */
  weight_metal: number
  /**
   * 杂料重
   */
  weight_other: number
}

interface ProductDamage {
  code: Product['code']
  reason: string
}
