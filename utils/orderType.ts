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
