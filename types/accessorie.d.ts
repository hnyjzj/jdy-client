interface ProductAccessories {
  /**
   * 名称 唯一字段
   */
  name: string
  /**
   * 产品入库单ID
   */
  enter_id?: string
  /**
   * ID
   */
  id: string
  /**
   * 状态
   */
  status: number
  /**
   * 库存
   */
  stock: number
  /**
   * 门店ID
   */
  store_id: string
  /**
   * 产品类型
   */
  type: number
  /**
   * 零售方式
   */
  retail_type: number
  /**
   * 备注
   */
  remark: string
  quantity?: number
}

/**
 * 配件详情
 */
interface ProductAccessoriesInfo extends ProductAccessories {
  store: Stores
}
