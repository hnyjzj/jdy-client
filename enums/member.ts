export enum MemberSource {
  all = 0,
  staffWrite,
  wxwork,
}

export const showMemberSource = (type?: number | string) => {
  switch (type) {
    case MemberSource.all:
      return '全部'
    case MemberSource.staffWrite:
      return '员工录入'
    case MemberSource.wxwork:
      return '企业微信'
  }
}

/**
 * 会员等级
 */
export enum MemberLevel {
  /**
   * 银卡
   */
  Silver = 1,
  /**
   * 金卡
   */
  Gold = 2,
  /**
   * 钻石卡
   */
  Diamond = 3,
}

/**
 * 会员状态
 */
export enum MemberStatus {
  /**
   * 正常
   */
  Normal = 1,
  /**
   * 未审核
   */
  Unreviewed = 2,
}

/**
 * 性别
 */
export enum Gender {
  Man = 1,
  Woman = 2,
}

export enum ChangeType {
  /**
   * 消费
   */
  Consume = 1,
  /**
   * 充值
   */
  Recharge = 2,
  /**
   * 兑换
   */
  Exchange = 3,
  /**
   * 退款
   */
  Refund = 4,
  /**
   * 取消兑换
   */
  CancelExchange = 5,
  /**
   * 取消退款
   */
  CancelRefund = 6,
  /**
   * 人工调整
   */
  ManualChange = 7,
}
