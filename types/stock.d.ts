interface StockTitle {
  title: string
  key: string
  width?: string
  fixed?: string
  className?: string
  align?: 'right' | 'left' | 'center' | undefined
}

interface BossWhere {
  type?: number
  duration?: number
  endTime?: string
  startTime?: string
}

interface BossSalesList {
  name: string
  total: string
  [key]: string
}

/** 门店库存 */
interface StatisticStock {
  day: string
  store_id: string
}

interface statisticSale {
  duration: number
  store_id: string
  startTime?: string
  endTime?: string
}
