export const useStock = defineStore('Stock', {
  state: () => ({
    stockDate: {} as Record<string, Record<string, string>>,
    stockWhere: {} as Where<StatisticStock>,
  }),
  actions: {
    async getStockWhere() {
      const { data } = await https.get<Where<StatisticStock>, null>('/statistic/stock/where', null, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.stockWhere = data.value.data
      }
    },
    async getStockData(params: StatisticStock) {
      const { data } = await https.post<Record<string, Record<string, string>>, StatisticStock>('/statistic/stock/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.stockDate = data.value.data
      }
    },
    async getSalesData(params: any) {
      const { data } = await https.post<Record<string, Record<string, string>>, any>('/statistic/sales/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.stockDate = data.value.data
      }
    },
  },
})
