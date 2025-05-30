/**
 * 销售明细Where
 */
interface StatementWhere {
  code?: string
  end_date?: string
  id?: string
  member_id?: string
  order_id?: string
  start_date?: string
  status?: number
  store_id?: string
  type?: number
}

/*
 * 退货明细where
 */
interface StatementRefundWhere {
  code?: string
  end_date?: string
  id?: string
  member_id?: string
  name?: string
  order_id?: string
  start_date?: string
  store_id?: string
}
interface StatementRefundInfo {
  code: string
  created_at: string
  id: string
  ip: string
  member: Member
  member_id: string
  name: string
  operator: any
  operator_id: string
  order_id: string
  order_type: number
  price: string
  price_original: string
  quantity: number
  remark: string
  store: Stores
  store_id: string
  type: number
  updated_at: string
}
