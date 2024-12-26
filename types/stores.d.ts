// 门店列表返回值
interface storesListRes {
  list: storesList[]
  total: number
}
// 门店列表请求参数
interface storeListReq {
  page: number
  limit: number
  where?: Where
}
interface Where {
  address?: string
  city?: string
  contact?: string
  district?: string
  name?: string
  parent_id?: string
  province?: string
}
// 门店列表
interface storesList {
  addressName?: string
  address: string
  city: string
  contact: string
  created_at: string
  district: string
  id: string
  parent: getStoreDetailRes | null
  logo?: string
  name: string
  parent_id: string
  province: string
  sort: number
  staffs: null
  updated_at: string
}
// 筛选表单
interface filterForm {
  address?: string
  city?: string
  contact?: string
  district?: string
  name?: string
  parent_id?: string
  province?: string
}
// 新增门店请求参数
interface addStoreReq extends filterForm {
  logo?: null | string
  sort: number | undefined
}

interface addStoreRes {
  code?: number
  meassage?: string
}

// 编辑门店参数
interface editStoreReq {
  id: string
  parent_id?: string
  logo?: string
  address: string
  city: string
  contact: string
  district: string
  name: string
  province: string
  sort: string | number
}
// 获取门店详情参数
interface getStoreDetailReq {
  id: string
}
// 获取门店详情返回值
interface getStoreDetailRes {
  addressName?: string
  address: string
  city: string
  contact: string
  created_at: string
  district: string
  id: string
  logo: string
  name: string
  parent: getStoreDetailRes | null
  parent_id: string
  province: string
  sort: number
  staffs: null
  updated_at: string
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
  parent_id?: null | string
  province: string
  sort: number | string
}
interface updateStoreRes {
  code?: number
  meassage?: string
}

interface deleteStoreReq {
  id: string
}
interface deleteStoreRes {
  code?: number
  meassage?: string
}

interface uploadFileRes {
  url: string
}
interface uploadLogoFileReq {
  image: File | undefined
  store_id?: string
}
