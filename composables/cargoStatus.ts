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

/**
 * 调拨单状态颜色
 */
export const AllocateStatusColorMap: Record<AllocateStatus, string> = {
  [AllocateStatus.Draft]: '#8B5CF6',
  [AllocateStatus.InTransit]: '#4F46E5',
  [AllocateStatus.Completed]: '#059669',
  [AllocateStatus.Cancelled]: '#374151',
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

export const EnterStatusColorMap: Record<EnterStatus, string> = {
  [EnterStatus.Draft]: '#8B5CF6',
  [EnterStatus.Completed]: '#059669',
  [EnterStatus.Cancelled]: '#374151',
}

/**
 * 盘点状态
 */
export enum CheckStatus {
  /** 草稿 */
  Draft = 1,
  /** 盘点中 */
  Checking,
  /** 待验证 */
  ToBeVerified,
  /** 盘点完成 */
  Checked,
  /** 盘点异常 */
  Abnormal,
  /** 盘点取消 */
  Cancel,
  /** 异常修复 */
  Repair,
}

/**
 * 盘点单状态颜色
 */
export const CheckStatusColorMap: Record<CheckStatus, string> = {
  [CheckStatus.Draft]: '#8B5CF6',
  [CheckStatus.Checking]: '#4F46E5',
  [CheckStatus.ToBeVerified]: '#D97706',
  [CheckStatus.Checked]: '#059669',
  [CheckStatus.Abnormal]: '#DC2626',
  [CheckStatus.Cancel]: '#374151',
  [CheckStatus.Repair]: '#0746a4',
}
