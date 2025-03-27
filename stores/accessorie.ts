export const useAccessorie = defineStore('Accessorie', {
  state: (): {
    accessorieList: ProductFinisheds[]
    accessorieFilterList: Where<ProductFinisheds>
    accessorieInfo: ProductFinisheds
    accessorieListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    accessorieFilterListToArray: FilterWhere<ProductFinisheds>[]
  } => ({
    accessorieFilterList: {} as Where<ProductFinisheds>,
    accessorieList: [],
    accessorieInfo: {} as ProductFinisheds,
    accessorieListTotal: 0,
    accessorieFilterListToArray: {} as FilterWhere<ProductFinisheds>[],
  }),
  actions: {
    // 配件列表
    async getAccessorieList(pamars: ReqList<ProductFinisheds>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<ProductFinisheds>, ReqList<ProductFinisheds>>('/product/accessorie/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.accessorieListTotal = data.value.data.total
          this.accessorieList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取配件筛选列表
    async getAccessorieWhere() {
      try {
        const { data } = await https.get<Where<ProductFinisheds>>('/product/accessorie/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.accessorieFilterList = data.value.data
          this.accessorieFilterListToArray = sortArr(this.accessorieFilterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 配件货品详情
    async getAccessorieInfo(code: ProductFinisheds['code']) {
      try {
        const { data } = await https.post<ProductFinisheds, { code: ProductFinisheds['code'] }>('/product/damage/info', { code })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.accessorieInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
  },
})
