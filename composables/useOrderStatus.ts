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

// 订金单状态
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
  HaveRefunded,
  /**
   * 已退货
   */
  Returned,
}

// 维修单订单状态
export enum serviceOrderStatus {
  /**
   * 待付款
   */
  PendingPayment = 1,
  /**
   *已取消
   */
  Cancelled = 2,
  /**
   *门店已收货
   */
  StoreReceived = 3,
  /**
   * 已退款
   */
  Refund = 4,
  /**
   *已送出维修
   */
  SentForRepair = 5,
  /**
   *维修中
   */
  UnderRepair = 6,
  /**
   *已维修送回
   */
  RepairedAndReturned = 7,
  /**
   *待取货
   */
  ReadyForPickup = 8,
  /**
   * 已完成
   */
  Completed,
}
