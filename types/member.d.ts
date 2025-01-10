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
  consultant?: Consultant
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
  store?: Store
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
 * 顾问信息
 */
interface Consultant {
  id: string
  phone: string
  nickname: string
  avatar: string
  email: string
  gender: Gender
  is_disabled: string
  stores: string
}

/**
 * 门店信息
 */
interface Store {
  id: string
  created_at: string
  updated_at: string
  name: string
  address: string
  contact: string
  logo: string
  sort: 0
  province: string
  city: string
  district: string
  staffs: Staff[]
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
