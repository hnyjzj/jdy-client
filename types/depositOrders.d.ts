interface DepositOrder {
  /**
   * 收银员ID
   */
  cashier_id?: string
  /**
   * 导购员ID
   */
  clerk_id?: string
  /**
   * 会员ID
   */
  member_id?: string
  payments: DepositOrderPayment[]
  /**
   * 应付金额
   */
  price?: number | string
  /**
   * 实付金额
   */
  price_pay?: number | string
  products: DepositOrderProduct[]
  /**
   * 订单备注
   */
  remark?: string
  /**
   * 订单状态
   */
  status?: number
  /**
   * 门店ID
   */
  store_id?: string

}

interface DepositOrderPayment {
  /**
   * 金额
   */
  amount?: number
  /**
   * 支付方式
   */
  payment_method?: number

}

interface DepositOrderProduct {
  /**
   * 是否我司产品
   */
  is_our?: boolean
  /**
   * 应付金额
   */
  price?: number
  /**
   * 金价
   */
  price_gold?: number
  /**
   * 手动添加
   */
  product_demand?: ProductFinisheds
  /**
   * 成品ID
   */
  product_id?: string
  product_finished?: ProductFinisheds
  product?: ProductFinisheds
}

interface DepositOrderInfo extends DepositOrder {
  id: string
  store: Stores
  member: Member
  clerk: Staff
  created_at: string
  cashier: Staff
}
