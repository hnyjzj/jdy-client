// 会员信息
interface MemberInfo {
  id?: number
  /**
   * 昵称
   */
  nickname?: string
  /**
   * 姓名
   */
  compellation?: string
  phone: string
  img?: string
  email?: string
  birthday?: string
  gender?: Gender
  remark?: string
  /**
   * 积分
   */
  integral?: number
  /**
   * 会员等级
   */
  level: MemberLevel
  /**
   * 购买次数
   */
  buyCount?: number
  /**
   * 是否关注公众号
   */
  isFollow?: IsFollow
  /**
   * 来源
   */
  source?: string
  /**
   * 专属顾问
   */
  adviser?: string
  /**
   * 入会门店
   */
  store?: string
  /**
   * 累计购买次数
   */
  totalBuyCount?: number
  /**
   * 参与活动次数
   */
  activityCount?: number
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 入会时间
   */
  joinTime?: string
  /**
   * 最近到店时间
   */
  lastVisitTime?: string
  /**
   * 收货信息
   */
  receiving?: Receiving
  /**
   * 用户状态
   */
  status?: MemberStatus
  /**
   * 消费记录
   */
  consumeRecords?: ConsumeRecord[]
}

/**
 * 收货信息
 */
interface Receiving {
  /**
   * 收货地址
   */
  address: string
  name: string
  phone: string
}

interface ConsumeRecord {
  /**
   * 消费金额
   */
  amount: number
  /**
   * 消费时间
   */
  time: string
  /**
   * 订单号
   */
  orderId: string
  /**
   * 商品名称
   */
  goodsName: string
  /**
   * 应付金额
   */
  shouldPay: number
  /**
   * 整单实付
   */
  payAmount: number
  /**
   * 数量
   */
  count: number
  /**
   * 状态
   */
  status: number
}

enum MemberLevel {
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

enum IsFollow {
  /**
   * 已关注
   */
  Followed = 1,
  /**
   * 未关注
   */
  Unfollowed = 2,
}

enum Gender {
  Man = 1,
  Woman = 2,
  Unknown = 3,
}

enum MemberStatus {
  /**
   * 正常
   */
  Normal = 1,
  /**
   * 未审核
   */
  Unreviewed = 2,
  /**
   * 禁用
   */
  Disabled = 3,
}
