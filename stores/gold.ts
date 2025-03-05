export const useGoldPrice = defineStore('goldPrice', {
  state: (): {
    goldPrice: number
    goldList: GoldPrices[]
    totalPage: number
  } => ({
    goldPrice: 0,
    goldList: [],
    totalPage: 0,
  }),
  actions: {
    // 获取今日金价
    async getGoldPrice(id: Stores['id']) {
      console.log('id', id)

      try {
        console.log('params', id)

        const { data } = await https.post<GoldPrices[], { store_id: Stores['id'] }>('/setting/gold_price/list', { store_id: id })
        console.log('goldPriceData', data.value)

        if (data.value?.code === HttpCode.SUCCESS) {
          this.goldList = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取黄金价格失败: ${error || '未知错误'}`)
      }
    },
    // /** 申请变更今日黄金价格 */
    // async setGoldPrice(price: number) {
    //   try {
    //     const { data } = await https.post<number, any>('/setting/gold_price/create', { price })
    //     return data.value
    //   }
    //   catch (error) {
    //     throw new Error(`获取黄金价格失败: ${error || '未知错误'}`)
    //   }
    // },
  },
})
