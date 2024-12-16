/**
 * 会员信息
 */
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

/**
 * 会员-消费记录
 */
interface ConsumeRecord {
  /**
   * 消费门店
   */
  store: string
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
  status: OrderStatus
}

/**
 * 积分记录
 */
interface Integral {
  userInfo: MemberInfo
  /**
   * 记录类型
   */
  type?: string
  /**
   * 积分变化
   */
  integral?: number
  /**
   * 变化原因
   */
  reason?: ChangeReason
  /**
   * 变化前
   */
  before?: number
  /**
   * 变化后
   */
  after?: number
  /**
   * 关联订单号
   */
  orderId: string
  /**
   * 创建时间
   */
  createTime?: string
}

/**
 * 客户维护
 */
interface CustomerMaintenance {
  userInfo: MemberInfo
  /**
   * 记录类型
   */
  type: MaintenanceType
  /**
   * 记录内容
   */
  content: string
  /**
   * 创建员工
   */
  staff: string
  /**
   * 员工手机
   */
  staffPhone: string
  /**
   * 所属门店
   */
  store: string
  /**
   * 创建时间
   */
  createTime: string
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

enum OrderStatus {
  /**
   * 已售
   */
  Sold = 1,
  /**
   * 已完成
   */
  Completed = 2,
  /**
   * 已回收
   */
  Recycle = 3,
}

/**
 * 积分记录-变化原因
 */
enum ChangeReason {
  /**
   * 销售
   */
  Sale = 1,
  /**
   * 兑换卡券
   */
  Exchange = 2,
  /**
   * 合并账号
   */
  Merge = 3,
  /**
   * 后台调整
   */
  Admin = 4,
  /**
   * 退货
   */
  Refund = 5,
  /**
   * 积分清零
   */
  Clear = 6,
  /**
   * 销售抵扣
   */
  SaleDiscount = 7,
  /**
   * 抽奖抵扣
   */
  Lottery = 8,
  /**
   * 系统赠送
   */
  Presented = 9,
  /**
   * 积分商城兑换礼品
   */
  IntegralShop = 10,
  /**
   * 积分商城退款
   */
  IntegralShopRefund = 11,
}

/**
 * 会员维护-记录类型
 */
enum MaintenanceType {
  /**
   * 核销
   */
  Check = 1,
  /**
   * 维修单
   */
  Repair = 2,
  /**
   * 销售单
   */
  Sale = 3,
  /**
   * 订金单
   */
  Deposit = 4,
  /**
   * 到店记录
   */
  Visit = 5,
  /**
   * 回访记录
   */
  Feedback = 6,
}
