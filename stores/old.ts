export const useOld = defineStore('Old', {
  state: (): {
    oldList: ProductFinisheds[]
    oldFilterList: Where<ProductFinisheds>
    oldInfo: ProductFinisheds
    oldListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    oldFilterListToArray: FilterWhere<ProductFinisheds>[]
  } => ({
    oldFilterList: {} as Where<ProductFinisheds>,
    oldList: [],
    oldInfo: {} as ProductFinisheds,
    oldListTotal: 0,
    oldFilterListToArray: {} as FilterWhere<ProductFinisheds>[],
  }),
  actions: {
    // 旧料列表
    async getOldList(pamars: ReqList<ProductFinisheds>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<ProductFinisheds>, ReqList<ProductFinisheds>>('/product/old/list', pamars)
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
        const { data } = await https.get<Where<ProductFinisheds>>('/product/old/where')
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
    async getOldInfo(id: ProductFinisheds['id']) {
      try {
        const { data } = await https.post<ProductFinisheds, { id: ProductFinisheds['id'] }>('/product/old/info', { id })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.oldInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    // 更新旧料货品
    async updateOldInfo(pamars: Partial<ProductFinisheds>) {
      try {
        const { data } = await https.put<ProductFinisheds, Partial<ProductFinisheds>>('/product/old/update', pamars)
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
