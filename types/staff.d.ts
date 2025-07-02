type StaffWhere = Partial<Staff>
/*
* 员工详情
*/
interface Staff {
  id?: string
  phone: string
  nickname: string
  username: string
  password?: string
  avatar: string
  email: string
  gender: number
  is_disabled?: boolean
  store_id?: string
  regions?: Region[]
  regions_superiors?: Region[]
  stores?: Store[]
  stores_superiors?: Store[]
}
/**
 * 添加员工请求参数
 */
interface addStaffReq {
  account?: Staff
  wxwork?: wxUserid
}
/**
 * 企业微信用户id
 */
interface wxUserid {
  user_id: string[]
}
/**
 * 添加员工表单
 */
interface addStaffForm extends Staff {
  password: string
}

interface updateStaffReq {
  platform: 'account' | 'wxwork'
  account?: Staff
  wxwork?: { code: string }
}
interface fileListArr {
  url: string
  isImage: true
}

interface updateStaffForm {
  id: string
  phone?: string
  nickname?: string
  username?: string
  avatar?: string
  email?: string
  gender?: number
  is_disabled?: boolean
  store_id?: string
  regions?: string[]
  regions_superiors?: string[]
  stores?: string[]
  stores_superiors?: string[]
}
