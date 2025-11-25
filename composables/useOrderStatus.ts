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

export const OrderStatusColor: Record<OrderStatusText, string> = {
  [OrderStatusText.OrderSalesProductStatusWaitPay]: '#D97706',
  [OrderStatusText.OrderSalesProductStatusCancel]: '#374151',
  [OrderStatusText.OrderSalesProductStatusComplete]: '#059669',
  [OrderStatusText.OrderSalesProductStatusRefund]: '#DC2626',
  [OrderStatusText.OrderSalesProductStatusReturn]: '#DC2626',
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
export const DepositOrderStatusColor: Record<DepositOrderStatus, string> = {
  [DepositOrderStatus.PendingPayment]: '#D97706',
  [DepositOrderStatus.Canceled]: '#374151',
  [DepositOrderStatus.Booking]: '#4F46E5',
  [DepositOrderStatus.Verified]: '#DC2626',
  [DepositOrderStatus.HaveRefunded]: '#DC2626',
  [DepositOrderStatus.Returned]: '#DC2626',
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
export const ServiceOrderStatusColor: Record<serviceOrderStatus, string> = {
  [serviceOrderStatus.PendingPayment]: '#D97706',
  [serviceOrderStatus.Cancelled]: '#374151',
  [serviceOrderStatus.StoreReceived]: '#4F46E5',
  [serviceOrderStatus.Refund]: '#DC2626',
  [serviceOrderStatus.SentForRepair]: '#DC2626',
  [serviceOrderStatus.UnderRepair]: '#4F46E5',
  [serviceOrderStatus.RepairedAndReturned]: '#059669',
  [serviceOrderStatus.ReadyForPickup]: '#D97706',
  [serviceOrderStatus.Completed]: '#059669',
}

export enum ProductFinishedsStatus {
  /**
   * 草稿
   */
  Draft = 1,
  /**
   * 正常
   */
  Normal = 2,
  /**
   * 已报损
   */
  ReportedLoss = 3,
  /**
   * 已调拨
   */
  Transferred = 4,
  /**
   * 已出售
   */
  Sold = 5,
  /**
   * 已定出
   */
  Reserved = 6,
  /**
   * 盘点中
   */
  Inventorying = 7,
  /**
   * 无库存
   */
  OutOfStock = 8,
}

export enum OrderProductType {
  /**
   * 成品
   */
  Finished = 1,
  /**
   * 旧料
   */
  OldMaterial = 2,
  /**
   * 配件
   */
  Parts = 3,
}

export enum OrderTypeSales {
  /**
   * 销售单
   */
  OrderTypeSale = 1,
  /**
   * 订金单
   */
  OrderTypeDeposit = 2,
  /**
   * 维修单
   */
  OrderTypeRepair = 3,
  /**
   * 其他收支单
   */
  OrderTypeOthers = 4,
  /**
   * 退货单
   */
  OrderTypeReturn = 5,

}
