// 销售单管理
interface SalesSlip {
  /**
   * 销售单号
   */
  num: string
  /**
   * 门店详情
   */
  store: StoreInfo
  /**
   * 会员详情
   */
  member: MemberInfo
  /**
   * 主销人员
   */
  mainSalesman: string
  /**
   * 货品信息
   */
  goodsInfo: string
  /**
   * 数量
   */
  quantity: number
  /**
   * 实收金额
   */
  realAmount: number
  /**
   * 货品金额
   */
  goodsAmount: number
  /**
   * 优惠金额
   */
  discountAmount: string
  /**
   * 旧料抵扣
   */
  oldDiscountAmount: string
  /**
   * 积分
   */
  integral: string
  /**
   * 开单方式
   */
  openType: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 状态
   */
  slipStatus: SlipStatus
}

// 销售单状态枚举
enum SlipStatus {
  /**
   * 已完成
   */
  Completed = 1,
  /**
   * 已撤销
   */
  Cancelled = 2,
  /**
   * 待付款
   */
  Unpaid = 3,
}

// 门店定义（？）
interface StoreInfo {
  name: string
  /**
   * 销售量
   */
  salesVolume: number
}

interface addSale {
  /**
   * 抹零金额
   */
  amount_reduce: number
  /**
   * 收银员ID
   */
  cashier_id: string | null
  /**
   * 整单折扣
   */
  discount_rate: number | undefined
  /**
   * 使用积分
   */
  integral_use: number
  /**
   * 会员ID
   */
  member_id: string | null
  products: saleProduct[]
  /**
   * 订单备注
   */
  remark: string
  salesmens: Salesmen[]
  /**
   * 订单来源
   */
  source?: number
  /**
   * 门店ID
   */
  store_id: string | null
  /**
   * 订单类型
   */
  type?: number | string
}

interface saleProduct {
  /**
   * 折扣
   */
  discount?: number
  /**
   * 产品ID
   */
  product_id: string
  /**
   * 数量，默认 为1
   */
  quantity: number
}

interface Salesmen {
  /**
   * 是否主导购员，默认为 false
   */
  is_main?: boolean
  /**
   * 业绩金额
   */
  performance_amount: number
  /**
   * 业绩比例
   */
  performance_rate: number
  /**
   * 导购员ID
   */
  salesman_id: string
}

interface Order {
  cashier_id: string
  end_date: string
  id: string
  member_id: string
  salesmen_id: string
  source: number
  start_date: string
  status: number
  store_id: string
  type: number
}
