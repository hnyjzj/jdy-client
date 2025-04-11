export const useAccessorie = defineStore('Accessorie', {
  state: (): {
    accessorieList: ProductAccessories[]
    accessorieFilterList: Where<ProductAccessories>
    accessorieInfo: ProductAccessories
    accessorieListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    accessorieFilterListToArray: FilterWhere<ProductAccessories>[]
  } => ({
    accessorieFilterList: {} as Where<ProductAccessories>,
    accessorieList: [],
    accessorieInfo: {} as ProductAccessories,
    accessorieListTotal: 0,
    accessorieFilterListToArray: {} as FilterWhere<ProductAccessories>[],
  }),
  actions: {
    // 配件列表
    async getAccessorieList(pamars: ReqList<ProductAccessories>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where } }
        const { data } = await https.post<ResList<ProductAccessories>, ReqList<ProductAccessories>>('/product/accessorie/list', pamars)
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
        const { data } = await https.get<Where<ProductAccessories>>('/product/accessorie/where')
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
    async getAccessorieInfo(id: string) {
      try {
        const { data } = await https.post<ProductAccessories, { id: string }>('/product/accessorie/info', { id })
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
