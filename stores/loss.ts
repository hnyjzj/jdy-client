export const useLoss = defineStore('Loss', {
  state: (): {
    lossList: Product[]
    lossFilterList: Where<Product>
    lossInfo: Product
    lossListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    lossFilterListToArray: FilterWhere<Product>[]
  } => ({
    lossFilterList: {} as Where<Product>,
    lossList: [],
    lossInfo: {} as Product,
    lossListTotal: 0,
    lossFilterListToArray: {} as FilterWhere<Product>[],
  }),
  actions: {
    // 报损列表
    async getLossList(pamars: ReqList<Product>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<Product>, ReqList<Product>>('/product/damage/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.lossListTotal = data.value.data.total
          this.lossList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取报损筛选列表
    async getLossWhere() {
      try {
        const { data } = await https.get<Where<Product>>('/product/damage/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.lossFilterList = data.value.data
          this.lossFilterListToArray = sortArr(this.lossFilterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 报损货品详情
    async getLossInfo(code: Product['code']) {
      try {
        const { data } = await https.post<Product, { code: Product['code'] }>('/product/damage/info', { code })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.lossInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    // 成品转换
    async convertLoss(pamars: ProductTransfer) {
      try {
        const { data } = await https.put<any, ProductTransfer>('/product/damage/conversion', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`转换失败: ${error || '未知错误'}`)
      }
    },
    // 产品报损
    async damageLoss(pamars: ProductDamage) {
      try {
        const { data } = await https.put<any, ProductDamage>('/product/damage', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`报损失败: ${error || '未知错误'}`)
      }
    },
  },
})
