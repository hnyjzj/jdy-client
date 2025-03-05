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
      try {
        const { data } = await https.post<GoldPrices[], { store_id: Stores['id'] }>('/setting/gold_price/list', { store_id: id })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.goldList = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取黄金价格失败: ${error || '未知错误'}`)
      }
    },
    // /** 添加/更新今日金价 */
    async setGoldPrice(params: UpdataGoldParams[]) {
      try {
        const { data } = await https.post<any, { options: UpdataGoldParams[] }>('/setting/gold_price/create', { options: params })
        return data.value
      }
      catch (error) {
        throw new Error(`获取黄金价格失败: ${error || '未知错误'}`)
      }
    },
  },
})
