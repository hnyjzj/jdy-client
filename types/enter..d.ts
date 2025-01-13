interface EnterReq {
  page: number
  limit: number
  where?: Partial<Enter>
}

// 产品类型
interface Enter {
  created_at: string
  id: string
  ip: string
  operator: null
  operator_id: string
  products: Product
  updated_at: string
}
