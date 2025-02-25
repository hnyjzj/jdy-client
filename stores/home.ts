export const homeDataStore = defineStore('homeDataStore', {
  state: () => ({
    StorePerformanceList: [] as StorePerformance[],
    todaySaleData: {} as todaySales,
  }),
  getters: {

  },
  actions: {
    // 获取店铺列表销售数据
    async StorePerformance(req: { duration: string }) {
      const { data } = await https.post<StorePerformance[], { duration: string }>('/statistic/store_sales_total', req)
      if (data.value.code === HttpCode.SUCCESS) {
        this.StorePerformanceList = data.value.data
      }
    },
    // 获取今日本店销售数据
    async myStoreTadaySale(req: { store_id: string }) {
      const { data } = await https.post<todaySales, { store_id: string }>('/statistic/today_sales', req)
      if (data.value.code === HttpCode.SUCCESS) {
        this.todaySaleData = data.value.data
      }
    },
  },
})
