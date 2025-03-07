type StoresWhere = Partial<Stores>
// 门店列表
interface Stores {
  addressName?: string
  address: string
  city: string
  contact: string
  created_at: string
  district: string
  id: string
  logo?: string
  name: string
  province: string
  sort: number
  staffs: Staff[]
  updated_at: string

  // 省市区
  region?: {
    province?: string
    city?: string
    district?: string
  }
}

interface StoresStaff {
  account: null
  accounts: null
  avatar: string
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
