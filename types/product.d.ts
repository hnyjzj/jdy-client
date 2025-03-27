// 产品类型
interface Produt {
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
  /** 证书1 */
  certificate1: string
  certificate2: string
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
  label_price: number
  /**
   * 产品入库单ID
   */
  enter_id: string
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
   * 产品状态--
   * 0 "全部",1 "正常",2 "已报损",3 "已调拨",4 "已出售",5 "退货" ,6 "盘点中"
   */
  status: 0 | 1 | 2 | 3 | 4 | 5 | 6
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
  weight_total: number
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
   * 产品类型
   * 0:全部 1:成品 2:旧料 3:配件
   */
  type: 0 | 1 | 2 | 3
  /**
   * 库存
   */
  stock: number
  /**
   * 门店id
   */
  store_id: string
  /**
   * 门店
   */
  store: Stores
  images: string[]
}
interface ProductDamage {
  code: ProductFinisheds['code']
  reason: string
}

interface ProductTransfer {
  id: ProductFinisheds['id']
  type: ProductFinisheds['type']
}

/**
 * 货品记录参数
 */
interface HistoryWhere {
  /**
   * 操作
   */
  action: number
  /**
   * 产品ID
   */
  product_id: string
  /**
   * 门店 ID
   */
  store_id: string
}

/**
 * 货品操作记录
 */
interface ProductHistories {
  /**
   * 操作
   */
  action: number
  /**
   * 创建时间
   */
  created_at: Date
  /**
   * ID
   */
  id: string
  /**
   * IP
   */
  ip: string
  /**
   * 键
   */
  key: string
  /**
   * 操作人ID
   */
  operator_id: string
  /**
   * 操作人信息
   */

  operator: Staff
  /**
   * 货品信息
   */
  new_value: Product
  /**
   * 更新后货品信息
   */
  old_value: Product
  /**
   * 产品ID
   */
  product_id: string
  /**
   * 来源id
   */
  source_id: string
  /**
   * 门店 ID
   */
  store_id: string
  /**
   * 更新时间
   */
  updated_at: Date
  /**
   * 值
   */
  value: any[] | boolean | number | number | { [key: string]: any } | null | string
}

/**
 * 上传产品图参数
 */
interface UploadProductImg {
  image: File
  product_id: string
}
