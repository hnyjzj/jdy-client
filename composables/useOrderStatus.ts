export enum OrderStatusText {

  /**
   * 待付款
   */
  OrderSalesProductStatusWaitPay = 1,
  /**
   * 已取消
   */
  OrderSalesProductStatusCancel,
  /**
   * 已完成
   */
  OrderSalesProductStatusComplete,
  /**
   * 有退款
   */
  OrderSalesProductStatusRefund,

  /**
   * 已退货
   */
  OrderSalesProductStatusReturn,

}

// 写法 1: 数字枚举 (推荐)
export enum DepositOrderStatus {
  /**
   * 待付款
   */
  PendingPayment = 1,
  /**
   * 已取消
   */
  Canceled,
  /**
   * 预定中
   */
  Booking,
  /**
   * 已核销
   */
  Verified,
  /**
   * 有退款
   */
  Refunded,
}
