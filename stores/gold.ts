export const useGoldPrice = defineStore('goldPrice', {
  state: (): {
    goldPrice: number
    goldList: GoldPrices[]
  } => ({
    goldPrice: 0,
    goldList: [],
  }),
  actions: {
    /** 获取今日黄金价格 */
    async getGoldPrice() {
      try {
        const { data } = await https.get<{ price: number }, null>('/setting/gold_price/get')
        if (data.value.code === HttpCode.SUCCESS) {
          this.goldPrice = data.value.data.price
        }
      }
      catch (error) {
        throw new Error(`获取黄金价格失败: ${error || '未知错误'}`)
      }
    },
    // 获取历史黄金价格列表
    async getGoldPriceList(params: ReqList) {
      try {
        const { data } = await https.post<ResList<GoldPrices>, ReqList>('/setting/gold_price/list', params)
        if (data.value.code === HttpCode.SUCCESS) {
          this.goldList = data.value.data.list
        }
      }
      catch (error) {
        throw new Error(`获取黄金价格失败: ${error || '未知错误'}`)
      }
    },
    /** 申请变更今日黄金价格 */
    async setGoldPrice(price: number) {
      try {
        const { data } = await https.post<number, any>('/setting/gold_price/create', { price })
        return data.value
      }
      catch (error) {
        throw new Error(`获取黄金价格失败: ${error || '未知错误'}`)
      }
    },
  },
})
