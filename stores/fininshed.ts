export const useFinished = defineStore('Finished', {
  state: (): {
    finishedList: Product[]
    finishedFilterList: Where<Product>
    finishedInfo: Product
    finishedListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    finishedFilterListToArray: FilterWhere<Product>[]
  } => ({
    finishedFilterList: {} as Where<Product>,
    finishedList: [],
    finishedInfo: {} as Product,
    finishedListTotal: 0,
    finishedFilterListToArray: {} as FilterWhere<Product>[],
  }),
  actions: {
    // 成品列表
    async getFinishedList(pamars: ReqList<Product>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<Product>, ReqList<Product>>('/product/finished/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.finishedListTotal = data.value.data.total
          this.finishedList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取成品筛选列表
    async getFinishedWhere() {
      try {
        const { data } = await https.get<Where<Product>>('/product/finished/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.finishedFilterList = data.value.data
          this.finishedFilterListToArray = sortArr(this.finishedFilterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 成品详情
    async getFinishedInfo(code: Product['code']) {
      try {
        const { data } = await https.post<Product, { code: Product['code'] }>('/product/finished/info', { code })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.finishedInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    // 更新成品
    async updateFinishedInfo(pamars: Partial<Product>) {
      try {
        const { data } = await https.put<Product, Partial<Product>>('/product/finished/update', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`更新失败: ${error || '未知错误'}`)
      }
    },
    // 成品转换
    async convertFinished(pamars: ProductTransfer) {
      try {
        const { data } = await https.put<any, ProductTransfer>('/product/finished/conversion', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`转换失败: ${error || '未知错误'}`)
      }
    },
    // 成品报损
    async damageFinished(pamars: ProductDamage) {
      try {
        const { data } = await https.put<any, ProductDamage>('/product/finished/damage', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`报损失败: ${error || '未知错误'}`)
      }
    },
  },
})
