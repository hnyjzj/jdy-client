/**
 * 订单状态枚举
 * 描述订单在生命周期中可能经历的所有业务状态
 */
export enum OrderStatus {
  /**
   * 待支付状态（初始状态）
   * @description
   * - 订单创建后等待用户完成支付
   * - 若超时未支付将自动转入取消状态
   */
  OrderStatusWaitPay = 0,

  /**
   * 已取消状态
   */
  OrderStatusCancel,

  /**
   * 已完成状态
   */
  OrderStatusComplete,

  /**
   * 已退款状态
   */
  OrderStatusRefund,

  /**
   * 已收货状态
   */
  OrderStatusReceived,

  /**
   * 派维修状态
   */
  OrderStatusSendRepair,

  /**
   * 维修中状态
   */
  OrderStatusRepairing,

  /**
   * 已维修状态
   */
  OrderStatusRepaired,

  /**
   * 待取货状态
   */
  OrderStatusWaitPickup,

  /**
   * 已预定状态
   */
  OrderStatusReserve,

  /**
   * 已核销状态
   */
  OrderStatusVerification,
}
