export const homeDataStore = defineStore('homeDataStore', {
  state: (): {
    todaySaleData?: Record<string, string> // 今日本店销售数据
    TodayInventory?: Record<string, string> // 今日库存数据
    Payments?: Record<string, string> // 今日收支数据
    targetStatistic?: Record<string, string> // 目标统计
  } => ({
    todaySaleData: {} as Record<string, string>,
    TodayInventory: {} as Record<string, string>,
    Payments: {} as Record<string, string>,
    targetStatistic: {} as Record<string, string>,
  }),

  getters: {

  },
  actions: {
    // 获取今日本店销售数据
    async myStoreTodaySale(req: { store_id: string }) {
      this.todaySaleData = undefined
      const { data } = await https.post<Record<string, string>, { store_id: string }>('/statistic/today/sales', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.todaySaleData = reorderObject(data.value.data)
      }
    },
    // 本店今日货品库存情况
    async myStoreTodayInventory(req: { store_id: string }) {
      this.TodayInventory = undefined
      const { data } = await https.post<Record<string, string>, { store_id: string }>('/statistic/today/product', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.TodayInventory = reorderObject(data.value.data)
      }
    },
    // 今日收支
    async myStoreTodayPayment(req: { store_id: string }) {
      this.Payments = undefined
      const { data } = await https.post<Record<string, string>, { store_id: string }>('/statistic/today/payment', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.Payments = reorderObject(data.value.data)
      }
    },
    /** 销售目标统计 */
    async getTargetStatistic(req: { store_id: string }) {
      this.targetStatistic = {}
      const { data } = await https.post<Record<string, string>, { store_id: string }>('/statistic/target', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.targetStatistic = data.value.data
      }
    },

  },
})
