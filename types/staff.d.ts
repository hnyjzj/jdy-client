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
  region_superiors?: Region[]
  stores?: Store[]
  store_superiors?: Store[]
  identity?: number
  role_id?: string
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
  code?: string
  password?: string
  nickname?: string
  avatar?: string
  email?: string
  gender?: number
}

interface fileListArr {
  url: string
  isImage: true
}

interface updateStaffForm {
  id: string
  phone?: string
  password?: string
  nickname?: string
  username?: string
  avatar?: string
  email?: string
  identity?: number
  gender?: number
  role_id?: string
  is_disabled?: boolean
  region_ids?: string[]
  region_superior_ids?: string[]
  store_ids?: string[]
  store_superior_ids?: string[]
}

interface updateRegion {
  id: string
  store_ids: string[]
  store_superior_ids: string[]
  region_ids: string[]
  region_superior_ids: string[]
}
/**
 * 更新员工密码
 */
interface updatePassword {
  id: string
  password: string
  store_ids: string[]
  store_superior_ids: string[]
  region_ids: string[]
  region_superior_ids: string[]
}

interface updateAuthRole {
  id: string
  role_id: string
  identity: number
  store_ids: string[]
  store_superior_ids: string[]
  region_ids: string[]
  region_superior_ids: string[]
}
