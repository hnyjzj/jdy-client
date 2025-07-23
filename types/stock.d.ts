interface StockTitle {
  title: string
  key: string
  width?: string
  fixed?: string
  className?: string
  align: 'right' | 'left' | undefined
}

interface Revenue {
  type: number
  duration: number
  endTime?: string
  startTime?: string
}
