type StoresWhere = Partial<Stores>
// 门店列表
interface Stores {
  admins: Staff[]
  alias: string
  contact: string
  created_at: string
  phone: string
  id: string
  name: string
  sort: number
  staffs: Staff[]
  updated_at: string
  superiors: Superior[]
  showtype?: 'list' | 'table'
  searchPage?: number
  limits?: number
  region?: Region
}

interface StoresStaff {
  account: null
  accounts: null
  avatar: string
  username: string
  created_at: string
  email: string
  gender: number
  id: string
  is_disabled: boolean
  nickname: string
  phone: string
  stores: null
  updated_at: string
}

interface uploadLogoFileReq {
  image: File | undefined
  store_id?: string
}
// 门店列表筛选请求参数

interface AssignStaff {
  id?: string
  staff_id: string[]
}

interface AssignSuperior {
  id?: string
  superior_id: string[]
}

interface AssignAdmin {
  id?: string
  admin_id: string[]
}
