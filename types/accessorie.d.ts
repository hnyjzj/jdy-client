interface ProductAccessories {
  /**
   * 配件条目
   */
  category: AccessorieCategory
  /**
   * 配件条目ID
   */
  code?: string
  /**
   * 创建时间
   */
  created_at?: Date | null
  /**
   * 删除时间
   */
  deleted_at?: Date | null
  /**
   * 入库单
   */
  enter?: null | ProductAccessorieEnters
  /**
   * 产品入库单ID
   */
  enter_id?: string
  /**
   * 入库时间
   */
  enter_time?: Date
  /**
   * ID
   */
  id?: string
  /**
   * 状态
   */
  status?: number
  /**
   * 库存
   */
  stock?: number
  /**
   * 门店
   */
  store?: null | Stores
  /**
   * 门店ID
   */
  store_id?: string
  /**
   * 产品类型
   */
  type?: number
  /**
   * 更新时间
   */
  updated_at?: Date | null
  /**
   * 入库入网费
   */
  assess_fee: number
}
