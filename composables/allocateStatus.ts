/**
 * 调拨单状态
 */
export enum AllocateStatus {
  /** 草稿 */
  Draft = 1,
  /** 在途 */
  InTransit,
  /** 已完成 */
  Completed,
  /** 已取消 */
  Cancelled,
}
