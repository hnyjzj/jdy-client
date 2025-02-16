interface Member {
  id: string
  /**
   * 姓名
   */
  name: string
  /**
   * 性别
   */
  gender: Gender
  /**
   * 身份证号
   */
  id_card: string
  /**
   * 昵称
   */
  nickname: string
  /**
   * 购买次数
   */
  buy_count?: number
  /**
   * 顾问
   */
  consultant?: Staff
  /**
   * 顾问id
   */
  consultant_id: string
  /**
   * 活动次数
   */
  event_count?: number
  /**
   * 积分
   */
  integral?: number
  /**
   * 手机号
   */
  phone: string
  /**
   * 来源
   */
  source?: number
  /**
   * 来源id
   */
  source_id?: string
  /**
   * 会员等级
   */
  level?: MemberLevel
  /**
   * 状态
   */
  status?: MemberStatus
  /**
   * 创建时间
   */
  created_at?: string
  /**
   * 创建时间
   */
  updated_at?: string
  /**
   * 入会门店
   */
  store?: Stores
  /**
   * 入会门店id
   */
  store_id: string
  /**
   * 纪念日
   */
  anniversary: string
  /**
   * 生日
   */
  birthday: string
}

/**
 * 会员积分详情
 */
interface IntegralRecord {
  /**
   * 变动后积分
   */
  after: number
  /**
   * 变动前积分
   */
  before: number
  /**
   * 变动积分
   */
  change: number
  /**
   * 变动类型
   */
  change_type: ChangeType
  /**
   * 创建时间
   */
  created_at: string
  /**
   * 删除时间
   */
  deleted_at: string
  /**
   * ID
   */
  id: string
  /**
   * 会员id
   */
  member_id: string
  /**
   * 变动原因
   */
  remark: string
  /**
   * 更新时间
   */
  updated_at: string
}

/**
 * 会员等级
 */
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

/**
 * 会员状态
 */
enum MemberStatus {
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
enum Gender {
  Man = 1,
  Woman = 2,
}

enum ChangeType {
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

type WhereParams = { [key in keyof Member]?: Member[key] }

interface IntegralReq {
  /**
   * 会员id
   */
  id: string
  /**
   * 变动积分数量
   */
  change: number
  /**
   * 原因
   */
  remark: string
}
