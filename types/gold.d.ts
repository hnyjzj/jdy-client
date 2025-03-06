/**
 * 金价列表
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
  price: Product['price']
  /**
   * 产品品牌
   */
  product_brand?: Product['brand'][]
  /**
   * 产品材质
   */
  product_material: Product['material']
  /**
   * 产品成色
   */
  product_quality: Product['quality'][]
  /**
   * 产品类型
   */
  product_type: Product['type']
  /**
   * 店铺ID
   */
  store_id: Stores['id']
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
  price?: Product['price']
  /**
   * 产品品牌
   */
  product_brand?: Product['brand'][]
  /**
   * 产品材质
   */
  product_material?: Product['material']
  /**
   * 产品成色
   */
  product_quality: Product['quality'][]
  /**
   * 产品类型
   */
  product_type?: Product['type']
  /**
   * 店铺ID
   */
  store_id: Stores['id']
}
