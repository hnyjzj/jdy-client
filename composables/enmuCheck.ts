/**
 * 盘点状态
 */
export enum CheckStatus {
  /** 全部 */
  All,
  /** 草稿 */
  Draft,
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
}
