// 门店列表返回值
interface storesListRes {
  list: stores[]
  total: number
}
// 门店列表请求参数
interface storeListReq {
  page: number
  limit: number
  where?: StoresWhere
}
interface StoresWhere {
  address?: string
  city?: string
  contact?: string
  district?: string
  name?: string
  province?: string
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
interface addStoreReq extends StoresWhere {
  logo?: null | string
  sort: number | undefined
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
