interface AccessorieEnterReq {
  page: number
  limit: number
  where?: Partial<AccessorieEnter>
}

// 产品类型
interface AccessorieEnter {
  /**
   * 创建时间
   */
  created_at: Date
  /**
   * 删除时间
   */
  deleted_at?: Date
  /**
   * ID
   */
  id: string
  /**
   * IP
   */
  ip?: string
  /**
   * 操作人
   */
  operator?: Staff
  /**
   * 操作人ID
   */
  operator_id?: string
  /**
   * 成品列表
   */
  products?: Products[]
  /**
   * 备注
   */
  remark?: string
  /**
   * 状态
   * 1:草稿 2:已完成 3:已撤销
   */
  status: 1 | 2 | 3
  store: Stores
  /**
   * 门店ID
   */
  store_id: string
  /**
   * 更新时间
   */
  updated_at: Date
  type: ProductAccessories['type']
}

/**
 * 添加成品入库单产品
 */
interface AccessorieEnterReq {
  /** 成品入库参数 */
  products: ProductAccessories[]
  enter_id: string
}

/**
 * 编辑入库单产品
 */
interface editAccessorieEnterReq {
  product: Partial<ProductAccessories>
  /**
   * 入库单 ID
   */
  enter_id: string
  /**
   * 产品 ID
   */
  product_id: string
}

/**
 * 创建入库单参数
 */
interface CreateAccessorieEnter {
  store_id: Stores['id']
  remark?: string
  type: number
}

/**
 * 删除入库单产品
 */
interface DelAccessorieEnter {
  /**
   * 入库单ID
   */
  enter_id: string
  /**
   * 商品ID列表
   */
  product_ids: string[]
}
