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

type WhereParams = { [key in keyof Member]?: Member[key] }

interface MemberReq {
  page: number
  limit: number
  where?: member
}
