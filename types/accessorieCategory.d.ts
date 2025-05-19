interface AccessorieCategory {

  /**
   * id-条目code
   */
  id: string

  /**
   * 入网费
   */
  access_fee: number
  /**
   * 品类
   */
  category: number
  /**
   * 条码
   */
  code: string
  /**
   * 颜色
   */
  color: string
  /**
   * 主石
   */
  gem: number
  /**
   * 标签价
   */
  label_price: number
  /**
   * 材质
   */
  material: number
  /**
   * 名称
   */
  name: string
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
   * 规格
   */
  specification: string
  /**
   * 供应商
   */
  supplier: string
  /**
   * 配件类型
   */
  type_part: number
  /**
   * 重量
   */
  weight: number
  /**
   *  门店id
   */
  store_id: Stores['id']
  /**
   * 产品信息
   */
  product: ProductAccessories
  /**
   * quantity 数量
   */
  quantity?: number
  /**
   * 应付金额
   */
  pay?: number
  /**
   * 入库数量
   */
  in_stock: number
  /**
   * 入库入网费
   */
  in_access_fee: number

}

interface CategoryProduct {
  stock: number
}

interface CategoryHasProduct extends AccessorieCategory {
  products: CategoryProduct[]
}
