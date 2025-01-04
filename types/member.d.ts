interface Member {
  id: string
  /**
   * 姓名
   */
  name: string
  /**
   * 购买次数
   */
  buy_count: number
  /**
   * 顾问
   */
  consultant: Consultant
  /**
   * 顾问id
   */
  consultant_id: string
  /**
   * 活动次数
   */
  event_count: number
  /**
   * 积分
   */
  integral: number
  /**
   * 手机号
   */
  phone: string
  /**
   * 来源
   */
  source: number
  /**
   * 来源id
   */
  source_id: string
  /**
   * 会员等级
   */
  level: MemberLevel
  /**
   * 状态
   */
  status: MemberStatus
  /**
   * 入会门店
   */
  store: Store
  /**
   * 入会门店id
   */
  store_id: string
  /**
   * 纪念日
   */
  anniversary: Date
  /**
   * 生日
   */
  birthday: Date
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
}

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

enum Gender {
  Man = 1,
  Woman = 2,
}

type MemberWhere = { [key in keyof Member]?: MemberFilterWhere }

type MemberKey = keyof Member

interface MemberFilterWhere {
  /**
   * 筛选条件
   */
  label: StringifiedUtil
  /**
   * 筛选预设
   */
  preset: null | object | array
  /**
   * 是否必填(仅添加上传时)
   */
  required: boolean
  type: number | string | float | string[]
  /**
   * 筛选类型 选择或输入
   */
  input: 'select' | 'text' | 'search' | 'switch' | 'number'
  sort: number
  show: boolean
  name: MemberKey
}

interface MemberReq {
  page: number
  limit: number
  where?: member
}

interface MemberRes {
  list: Member[]
  total: number
}
