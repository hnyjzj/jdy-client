// 门店列表返回值
interface storesListRes {
  list: stores[]
  total: number
}
// 门店列表请求参数
interface StoresWhere {
  address?: string
  city: string | undefined
  contact?: string
  district: string | undefined
  name?: string
  province: string | undefined
}
// 门店列表
interface stores {
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
}

// 门店详情
interface storeDetailReq {
  id: string
}

interface storeDeleteReq {
  id: string
}
// 新增门店请求参数
interface StoreAddorUpdateReq extends StoresWhere {
  logo?: null | string
  id?: string
  sort?: number | undefined
}

// 更新门店
interface updateStoreReq {
  address: string
  city: string
  contact: string
  district: string
  id: string
  logo?: null | string
  name: string
  province: string
  sort: number | string
}

interface uploadLogoFileReq {
  image: File | undefined
  store_id?: string
}

type StoreWhereParams = { [key in keyof Stores]?: Stores[key] }
// 门店列表筛选请求参数
interface storesWhereReq {
  page: number
  limit: number
  where?: StoreWhereParams
}
// 筛选列表请求参数
interface Stores {
  address: string
  city: string
  contact: string
  name: string
  region: {
    province: string
    city: string
    district: string
  }
}
type StoreWhere = { [key in keyof Stores]?: FilterWhere }

// 选择省市区组件需要的参数
interface provinceForm {
  province: string | undefined
  city: string | undefined
  district: string | undefined
}
