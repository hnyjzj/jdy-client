export const useSale = defineStore('Sale', {
  state: () => ({
    filterList: {} as Where<Order>,
    todayPrice: 0 as number,
  }),
  actions: {
    // 获取筛选条件
    async getSaleWhere() {
      const { data } = await https.get<Where<Order>, null>('/order/where')
      if (data.value.code === HttpCode.SUCCESS) {
        this.filterList = data.value.data
      }
    },

    // 获取今日金价
    async getTodayPrice() {
      const { data } = await https.get<any, null>('/setting/gold_price/get')
      if (data.value.code === HttpCode.SUCCESS) {
        this.todayPrice = data.value.data.price
      }
    },
    async submitOrder(req: addSale) {
      await https.post('/order/create', req)
    },
  },
})
