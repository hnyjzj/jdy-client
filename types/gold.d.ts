/**
 * GoldPrices
 */
interface GoldPrices {
  /**
   * 审批时间
   */
  approved_at: Date
  /**
   * 审批人ID
   */
  approver_id: string
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
   * 发起人ID
   */
  initiator_id: string
  /**
   * IP地址
   */
  ip: string
  /**
   * 金价
   */
  price?: number
  /**
   * 状态，0待审批、1已审批、2已驳回
   */
  status: number
  /**
   * 更新时间
   */
  updated_at: Date
  /** 发起申请人信息 */
  approver: Staff
}
