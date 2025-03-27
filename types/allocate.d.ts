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
   * 调拨商品
   */
  product?: ProductFinisheds[]
  /**
   * 调拨状态
   * 0:全部 1:盘点中 2:调拨中 3:已完成 4:已取消
   */
  status: number
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
