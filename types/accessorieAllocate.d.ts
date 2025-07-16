/**
 * 产品调拨
 */
interface AccessorieAllocate {
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
  ip: string
  /**
   * 调拨方式
   */
  method: number
  /**
   * 操作人ID
   */
  operator_id: string
  /**
   * 操作人信息
   */
  operator: Staff
  /**
   * 调拨原因
   */
  reason: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 调拨门店
   */
  store_id?: string
  /**
   * 产品类型
   */
  type: number
  /**
   * 更新时间
   */
  updated_at: Date
  /**
   * 调拨商品
   */
  products?: allocateProduct[]
  /**
   * 调拨状态
   * 1:草稿 2:在途 3:已完成 4:已取消
   */
  status: AllocateStatus
  /**
   * 调出门店id
   */
  from_store_id?: string
  /**
   * 调出门店信息
   */
  from_store: Stores
  /**
   * 调入门店id
   */
  to_store_id?: string
  /**
   * 调入门店信息
   */
  to_store: Stores
  start_time: Date
  end_time: Date
  /** 调拨总数 */
  product_count?: number
  /** 调拨总件数 */
  product_total?: number
}

interface allocateProduct {
  allocate_id: string
  product_id: string
  quantity: number
  product: ProductAccessories
}

interface AccessorieAllocateReq {
  /**
   * 调出门店
   */
  from_store_id?: string
  /**
   * 调拨方式
   */
  method: number
  /**
   * 调拨原因
   */
  reason: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 状态
   */
  status?: number
  /**
   * 调入门店
   */
  to_store_id?: string
  /**
   * 产品类型
   */
  type: number
  /**
   * 门店id
   */
  store_id: string
  /**
   * 入库单id
   */
  enter_id?: Enter['id']
}
interface AddAccessorieAllocateProduct {
  /**
   * 产品id
   */
  product_id: string
  /**
   * 数量
   */
  quantity: number
}
/**
 * 添加调拨配件
 */
interface AddAccessorieAllocateReq {
  /**
   * 调拨单id
   */
  id: string
  products: AddAccessorieAllocateProduct[]
}
