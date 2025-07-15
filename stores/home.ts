export const homeDataStore = defineStore('homeDataStore', {
  state: () => ({
    StorePerformanceList: [] as StorePerformance[],
    todaySaleData: {} as todaySales, // 今日本店销售数据
    TodayInventory: {} as TodayInventory, // 今日库存数据
  }),
  getters: {

  },
  actions: {
    // 获取店铺列表销售数据
    async StorePerformance(req: { duration: string }) {
      const { data } = await https.post<StorePerformance[], { duration: string }>('/statistic/store_sales_total', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.StorePerformanceList = data.value.data
        return data.value?.code
      }
      else {
        return data.value?.code
      }
    },
    // 获取今日本店销售数据
    async myStoreTodaySale(req: { store_id: string }) {
      const { data } = await https.post<todaySales, { store_id: string }>('/statistic/today_sales', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.todaySaleData = data.value.data
        return data.value?.code
      }
      else {
        return data.value?.code
      }
    },
    // 本店今日货品库存情况
    async myStoreTodayInventory(req: { store_id: string }) {
      const { data } = await https.post<TodayInventory, { store_id: string }>('/statistic/today_product', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.TodayInventory = data.value.data
        return data.value?.code
      }
      else {
        return data.value?.code
      }
    },
  },
})
