/**
 * 添加员工请求参数
 */
interface addStaffReq {
  account?: addStaffAccount
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
  account: addStaffAccount
}
/**
 * 添加员工表单
 */
interface addStaffAccount {
  phone: string
  username: string
  nickname: string
  password: string
  avatar: string
  email: string
}
/**
 * 添加员工返回
 */
interface addStaffRes {
  code: number
  message: string
}
