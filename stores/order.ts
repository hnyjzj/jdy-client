export const useOrder = defineStore('Order', {
  state: () => ({
    filterList: {} as Where<Orders>,
    todayPrice: '' as string,
  }),
  actions: {
    // 获取筛选条件
    async getSaleWhere() {
      const { data } = await https.get<Where<Orders>, null>('/order/where')
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
    async submitOrder(req: Orders) {
      const { data } = await https.post<undefined, Orders>('/order/create', req)
      return data.value
    },
  },
})
