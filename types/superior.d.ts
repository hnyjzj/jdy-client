type SuperiorWhere = Partial<Superior>
/*
* 员工详情
*/
interface Superior {
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
}
/**
 * 添加员工请求参数
 */
interface addSuperiorReq {
  account?: Superior
  wxwork?: wxUserid
}

interface addSuperiorForm extends Superior {
  password: string
}

interface updateSuperiorReq {
  platform: 'account' | 'wxwork'
  account?: Superior
  wxwork?: { code: string }
}
