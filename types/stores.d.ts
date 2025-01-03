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
  staffs: null
  updated_at: string

  // 省市区
  region?: {
    province?: string
    city?: string
    district?: string
  }
}

interface uploadLogoFileReq {
  image: File | undefined
  store_id?: string
}
// 门店列表筛选请求参数
interface storesWhereReq {
  page: number
  limit: number
  where?: StoreWhereParams
}

type Where<T = any> = { [key in keyof T]?: FilterWhere<T> }
