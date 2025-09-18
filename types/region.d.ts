type RegionWhere = Partial<Region>
// 门店列表
interface Region {
  admins: Staff[]
  alias: string
  addressName?: string
  address: string
  city: string
  created_at: string
  district: string
  id: string
  name: string
  province: string
  sort: number
  staffs: Staff[]
  updated_at: string
  superiors: Staff[]
  stores: Stores[]
  region_id?: string
  limits?: number
  searchPage?: number
  showtype?: 'list' | 'table'
}

interface RegionStaff {
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

// 门店列表筛选请求参数

interface RegionAssignStaff {
  id?: string
  staff_id: string[]
}
interface RegionAssignsuperior {
  id?: string
  superior_id: string[]
}
interface RegionAssignAdmin {
  id?: string
  admin_id: string[]
}
interface RegionassignStores {
  id?: string
  store_id: string[]
}
