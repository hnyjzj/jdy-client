export const useOld = defineStore('Old', {
  state: (): {
    oldList: Product[]
    oldFilterList: Where<Product>
    oldInfo: Product
    oldListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    oldFilterListToArray: FilterWhere<Product>[]
  } => ({
    oldFilterList: {} as Where<Product>,
    oldList: [],
    oldInfo: {} as Product,
    oldListTotal: 0,
    oldFilterListToArray: {} as FilterWhere<Product>[],
  }),
  actions: {
    // 旧料列表
    async getOldList(pamars: ReqList<Product>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<Product>, ReqList<Product>>('/product/old/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.oldListTotal = data.value.data.total
          this.oldList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取旧料筛选列表
    async getOldWhere() {
      try {
        const { data } = await https.get<Where<Product>>('/product/old/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.oldFilterList = data.value.data
          this.oldFilterListToArray = sortArr(this.oldFilterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 旧料货品详情
    async getOldInfo(id: Product['id']) {
      try {
        const { data } = await https.post<Product, { id: Product['id'] }>('/product/old/info', { id })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.oldInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    // 更新旧料货品
    async updateOldInfo(pamars: Partial<Product>) {
      try {
        const { data } = await https.put<Product, Partial<Product>>('/product/old/update', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`更新失败: ${error || '未知错误'}`)
      }
    },
    // 旧料转换
    async convertOld(pamars: ProductTransfer) {
      try {
        const { data } = await https.put<any, ProductTransfer>('/product/old/conversion', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`转换失败: ${error || '未知错误'}`)
      }
    },
  },
})
