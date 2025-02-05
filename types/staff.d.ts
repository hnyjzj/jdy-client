type StaffWhere = Partial<Staff>
/*
* 员工详情
*/
interface Staff {
  id?: string
  phone: string
  nickname: string
  password: string
  avatar: string
  email: string
  gender: number
  is_disabled?: boolean
  store_id: string
}
/**
 * 添加员工请求参数
 */
interface addStaffReq {
  account?: Staff
  platform: string
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
interface addStaffForm {
  platform: string
  account: Staff
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
