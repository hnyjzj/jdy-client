export const useSale = defineStore('Sale', {
  state: () => ({
    filterList: {} as Where<WhereSale>,
    todayPrice: 0 as number,
  }),
  actions: {
    async getSaleWhere() {
      const { data } = await https.get<Where<WhereSale>, null>('/order/where')
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
  },
})
