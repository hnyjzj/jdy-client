interface Member {
  id: string
  /**
   * 姓名
   */
  name: string
  /**
   * 性别
   */
  gender: number & { value: number, text: string }
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
  source?: EnumRes<number>
  /**
   * 来源id
   */
  source_id?: string
  /**
   * 会员等级
   */
  level?: EnumRes<number>
  /**
   * 状态
   */
  status?: EnumRes<number>
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
  change_type: EnumRes<number>
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
