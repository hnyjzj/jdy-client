interface EnterReq {
  page: number
  limit: number
  where?: Partial<Enter>
}

// 产品类型
interface Enter {
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
}

/**
 * 添加入库单产品
 */
interface EnterProductReq {
  products: Product[]
  product_enter_id: string
}

/**
 * 编辑入库单产品
 */
interface editEnterProductReq {
  product: Partial<Product>
  /**
   * 入库单 ID
   */
  product_enter_id: string
  /**
   * 产品 ID
   */
  product_id: string
}
