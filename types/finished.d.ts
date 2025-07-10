/**
 * ProductFinisheds，成品
 */
interface ProductFinisheds {
  /**
   * 入网费
   */
  access_fee: number | string
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
  /** 证书1 */
  certificate1: string
  /** 证书2 */
  certificate2: string
  /**
   * 主石净度
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
   * 主石色
   */
  color_gem: number
  /**
   * 贵金属颜色
   */
  color_metal: string
  /**
   * 工艺
   */
  craft: number
  /**
   * 创建时间
   */
  created_at: Date | null
  /**
   * 删除时间
   */
  deleted_at: Date | null
  /**
   * 入库单
   */
  enter: null | ProductFinishedEnters
  /**
   * 成品入库单ID
   */
  enter_id: string
  /**
   * 入库时间
   */
  enter_time: Date
  /**
   * 主石
   */
  gem: number
  /**
   * ID
   */
  id: string
  /**
   * 图片
   */
  images: string[]
  /**
   * 是否特价
   */
  is_special_offer: boolean
  /**
   * 标签价
   */
  label_price: string
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
   * 杂料数
   */
  num_other: number
  /**
   * 成色
   */
  quality: number
  /**
   * 备注
   */
  remark: string
  /**
   * 零售方式
   */
  retail_type: number
  /**
   * 系列
   */
  series: string
  /**
   * 手寸
   */
  size: string
  /**
   * 产品状态--
   *
   */
  status: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  /**
   * 门店
   */
  store: Stores
  /**
   * 门店ID
   */
  store_id: string
  /**
   * 款式
   */
  style: string
  /**
   * 供应商
   */
  supplier: number
  /**
   * 产品类型
   * 0:全部 1:成品 2:旧料 3:配件
   */
  type: 0 | 1 | 2 | 3
  /**
   * 更新时间
   */
  updated_at: Date
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
  /**
   * 总重
   */
  weight_total: number
  /**
   * 库存
   */
  stock: number

  rate?: number

  all?: boolean
}

/**
 * 创建入库单参数
 */
interface CreateProductFinishedEnter {
  store_id: Stores['id']
  remark?: string
}

/**
 * 删除入库单产品
 */
interface DelProductFinishedEnter {
  /**
   * 入库单ID
   */
  enter_id: string
  /**
   * 商品ID列表
   */
  product_ids: string[]
}

/**
 * 更新图片参数
 */
interface UpdateProductFinishedImages {
  /**
   * 商品ID
   */
  id: ProductFinisheds['id']
  /**
   * 图片列表
   */
  images: string[]
}
