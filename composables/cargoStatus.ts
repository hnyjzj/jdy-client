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

/** 入库单状态 */
export enum EnterStatus {
  /** 草稿 */
  Draft = 1,
  /** 已完成 */
  Completed,
  /** 已取消 */
  Cancelled,
}
