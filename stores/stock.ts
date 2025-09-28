export const useStock = defineStore('Stock', {
  state: () => ({
    stockDate: {} as Record<string, Record<string, string>>,
    stockWhere: {} as Where<StatisticStock>,
    salesData: {} as Record<string, Record<string, string>>,
    salesWhere: {} as Where<any>,
    salesPersonalStatistics: {} as Record<string, Record<string, string>>,
  }),
  actions: {
    async getStockWhere() {
      const { data } = await https.get<Where<StatisticStock>, null>('/statistic/stock/where', null, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.stockWhere = data.value.data
      }
    },
    async getStockData(params: StatisticStock) {
      const { data } = await https.post<any, StatisticStock>('/statistic/stock/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.stockDate = data.value.data
        this.stockDate.overview = reorderObject(this.stockDate.overview)
      }
    },
    /** 销售数据 */
    async getSalesData(params: statisticSale) {
      const { data } = await https.post<any, statisticSale>('/statistic/sales/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.salesData = data.value.data
        this.salesData.overview = reorderObject(this.salesData.overview)
        this.salesPersonalStatistics = Object.fromEntries(
          Object.entries(this.salesData.list).map(([person, metrics]) => [
            person,
            reorderObject(typeof metrics === 'object' ? metrics : {}),
          ]),
        )
      }
    },
    async getSalesWhere() {
      const { data } = await https.get<Where<statisticSale>, null>('/statistic/sales/where', null, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.salesWhere = data.value.data
      }
    },
  },
})
