/**
 * GoldPrices
 */
interface GoldPrices {
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
   * 金价
   */
  price: number | string
  /**
   * 产品品牌
   */
  product_brand?: number[]
  /**
   * 产品材质
   */
  product_material: number
  /**
   * 产品成色
   */
  product_quality: number[]
  /**
   * 产品类型
   * 0: 全部 1: 成品 2: 旧料 3: 配件
   */
  product_type: 0 | 1 | 2 | 3
  /**
   * 店铺ID
   */
  store_id: string
  /**
   * 更新时间
   */
  updated_at?: Date
}

// 添加/更新金价参数
interface UpdataGoldParams {
  /**
   * ID
   */
  id?: string
  /**
   * 金价
   */
  price: number
  /**
   * 产品品牌
   */
  product_brand?: number[]
  /**
   * 产品材质
   */
  product_material: number
  /**
   * 产品成色
   */
  product_quality: number[]
  /**
   * 产品类型
   * 0: 全部 1: 成品 2: 旧料 3: 配件
   */
  product_type: 0 | 1 | 2 | 3
  /**
   * 店铺ID
   */
  store_id: string
}
