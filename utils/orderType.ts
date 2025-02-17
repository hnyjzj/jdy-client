export enum OrderType {
  /**
   * 销售单
   */
  Sale = 1,
  /**
   * 定金单
   */
  Deposit,
  /**
   * 维修单
   */
  Maintenance,
  /**
   * 其他
   */
  Other,
}

export const OrderTypeMap = {
  1: '销售单',
  2: '定金单',
  3: '维修单',
  4: '其他',
}

export enum OrderStatus {
  all = 0,
  PendingPayment,
  Cancelled,
  Completed,
  RefundReceived,
  ReceivedGoods,
  DispatchMaintenance,
  UnderRepair,
  Repaired,
  ToBePicked,
  Booked,
  Verified,
}

export const OrderStatusMap = {
  0: '全部',
  1: '待付款',
  2: '已取消',
  3: '已完成',
  4: '已退款',
  5: '已收货',
  6: '派维修',
  7: '维修中',
  8: '已维修',
  9: '待取货',
  10: '已预约',
  11: '已核销',
}

export enum OrderSource {
  all = 0,
  nature,
  returnVisit,
  transform,
}

export const OrderSourceMap = {
  0: '全部',
  1: '自然客流',
  2: '回访邀约',
  3: '营销转化',
}
