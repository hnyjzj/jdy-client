export const homeDataStore = defineStore('homeDataStore', {
  state: (): {
    todaySaleData?: todaySales // 今日本店销售数据
    TodayInventory?: TodayInventory // 今日库存数据
    Payments?: Record<string, string> // 今日收支数据
  } => ({
    todaySaleData: undefined,
    TodayInventory: undefined,
    Payments: undefined,
  }),

  getters: {

  },
  actions: {
    // 获取今日本店销售数据
    async myStoreTodaySale(req: { store_id: string }) {
      this.todaySaleData = undefined
      const { data } = await https.post<todaySales, { store_id: string }>('/statistic/today/sales', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.todaySaleData = data.value.data
      }
    },
    // 本店今日货品库存情况
    async myStoreTodayInventory(req: { store_id: string }) {
      this.TodayInventory = undefined
      const { data } = await https.post<TodayInventory, { store_id: string }>('/statistic/today/product', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.TodayInventory = data.value.data
      }
    },
    // 今日收支
    async myStoreTodayPayment(req: { store_id: string }) {
      this.Payments = undefined
      const { data } = await https.post<Record<string, string>, { store_id: string }>('/statistic/today/payment', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.Payments = data.value.data
      }
    },
  },
})
