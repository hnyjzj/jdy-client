export const homeDataStore = defineStore('homeDataStore', {
  state: (): {
    StorePerformanceList?: StorePerformance[]
    todaySaleData?: todaySales // 今日本店销售数据
    TodayInventory?: TodayInventory // 今日库存数据
  } => ({
    StorePerformanceList: undefined,
    todaySaleData: undefined,
    TodayInventory: undefined,
  }),

  getters: {

  },
  actions: {
    // 获取店铺列表销售数据
    async StorePerformance(req: { duration: string }) {
      this.StorePerformanceList = undefined
      const { data } = await https.post<StorePerformance[], { duration: string }>('/statistic/store_sales_total', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.StorePerformanceList = data.value.data
      }
    },
    // 获取今日本店销售数据
    async myStoreTodaySale(req: { store_id: string }) {
      this.todaySaleData = undefined
      const { data } = await https.post<todaySales, { store_id: string }>('/statistic/today_sales', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.todaySaleData = data.value.data
      }
    },
    // 本店今日货品库存情况
    async myStoreTodayInventory(req: { store_id: string }) {
      this.TodayInventory = undefined
      const { data } = await https.post<TodayInventory, { store_id: string }>('/statistic/today_product', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.TodayInventory = data.value.data
      }
    },
  },
})
