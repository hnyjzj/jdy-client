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
