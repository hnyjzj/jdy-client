enum OrderType {
  // 销售单
  Sale = 1,
  //   定金单
  Deposit = 2,
  // 维修单
  Maintenance = 3,
  //   其他
  Other = 4,
}
// 定单类型
export const showType = (type?: number | string) => {
  switch (type) {
    case OrderType.Sale:
      return '销售单'
    case OrderType.Deposit:
      return '定金单'
    case OrderType.Maintenance:
      return '维修单'
    case OrderType.Other:
      return '其他'
    default:
      return ''
  }
}

enum OrderSource {
  all = 0,
  nature,
  returnVisit,
  transform,
}

export const showSource = (type?: number | string) => {
  switch (type) {
    case OrderSource.all:
      return '全部'
    case OrderSource.nature:
      return '自然客流'
    case OrderSource.returnVisit:
      return '回访邀约'
    case OrderSource.transform:
      return '营销转化'
    default:
      return ''
  }
}
enum OrderStatus {
  All = 0,
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
export const showStatus = (type?: number | string) => {
  switch (type) {
    case OrderStatus.All:
      return '全部'
    case OrderStatus.PendingPayment:
      return '待付款'
    case OrderStatus.Cancelled:
      return '已取消'
    case OrderStatus.Completed:
      return '已完成'
    case OrderStatus.RefundReceived:
      return '已退款'
    case OrderStatus.ReceivedGoods:
      return '已收货'
    case OrderStatus.DispatchMaintenance:
      return '派维修'
    case OrderStatus.UnderRepair:
      return '维修中'
    case OrderStatus.Repaired:
      return '已维修'
    case OrderStatus.ToBePicked:
      return '待取件'
    case OrderStatus.Booked:
      return '已预约'
    case OrderStatus.Verified:
      return '已核销'
    default:
      return ''
  }
}
