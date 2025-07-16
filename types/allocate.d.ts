/**
 * 产品调拨
 */
interface Allocate {
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
   * 调拨单成品列表
   */
  product_finisheds: ProductFinisheds[]
  /**
   * 调拨单成品列表
   */
  product_olds: ProductOlds[]
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
  /** 总数量 */
  product_count: number
  /** 总入网费 */
  product_total_access_fee: number
  /** 总标签价 */
  product_total_label_price: number
  /** 总重 */
  product_total_weight_metal: number
}

interface AllocateReq {
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
