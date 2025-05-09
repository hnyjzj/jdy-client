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
  price: ProductFinisheds['price']
  /**
   * 产品品牌
   */
  product_brand?: ProductFinisheds['brand'][]
  /**
   * 产品材质
   */
  product_material: ProductFinisheds['material']
  /**
   * 产品成色
   */
  product_quality: ProductFinisheds['quality'][]
  /**
   * 产品类型
   */
  product_type: ProductFinisheds['type']
  /**
   * 店铺ID
   */
  store_id: Stores['id']
  /**
   * 更新时间
   */
  updated_at?: Date
}

interface UpdataGoldParams {
  options: UpdataGold[]
  /**
   * 删除金价参数
   */
  deletes?: GoldPrices['id'][]
}

// 添加/更新金价参数
interface UpdataGold {
  /**
   * ID
   */
  id?: string
  /**
   * 金价
   */
  price?: ProductFinisheds['price']
  /**
   * 产品品牌
   */
  product_brand?: ProductFinisheds['brand'][]
  /**
   * 产品材质
   */
  product_material?: ProductFinisheds['material']
  /**
   * 产品成色
   */
  product_quality: ProductFinisheds['quality'][]
  /**
   * 产品类型
   */
  product_type?: ProductFinisheds['type']
  /**
   * 店铺ID
   */
  store_id: Stores['id']
}
