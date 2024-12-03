interface storesListRes {
  list: storesList[]
  page: storesPage
}

interface storesList {
  address?: string
  city?: string
  contact?: string
  created_at?: string
  district?: string
  id?: string
  logo?: string
  name?: string
  parent_id?: string
  province?: string
  sort?: number
  staffs?: null
  updated_at?: string
  wxwork_id?: number
}

interface storesPage {
  total: number
}

interface filterForm {
  address?: string | undefined
  city?: string | undefined
  contact?: string | undefined
  district?: string | undefined
  name?: string | undefined
  parent_id?: string | undefined
  province?: string | undefined
  wxwork_id?: number | undefined
}
