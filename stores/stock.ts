export const useStock = defineStore('Stock', {
  state: () => ({
    stockDate: {} as Record<string, Record<string, string>>,
    stockWhere: {} as Where<StatisticStock>,
    salesData: {} as Record<string, Record<string, string>>,
    salesWhere: {} as Where<any>,
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
    /** 销售数据 */
    async getSalesData(params: any) {
      const { data } = await https.post<Record<string, Record<string, string>>, any>('/statistic/sales/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.salesData = data.value.data
      }
    },
    async getSalesWhere() {
      const { data } = await https.get<Where<any>, null>('/statistic/sales/where', null, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.salesWhere = data.value.data
      }
    },
  },
})
