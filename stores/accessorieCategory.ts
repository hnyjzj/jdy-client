export const useAccessorieCategory = defineStore('Category', {
  state: (): {
    categoryList: AccessorieCategory[]
    categoryListTotal: number
    categoryFilterList: Where<AccessorieCategory>
    categoryFilterListToArray: FilterWhere<AccessorieCategory>[]
  } => ({
    categoryList: [],
    categoryListTotal: 0,
    categoryFilterList: {} as Where<AccessorieCategory>,
    categoryFilterListToArray: [] as FilterWhere<AccessorieCategory>[],
  }),
  actions: {
    // 配件条目
    async getAccessorieCategoryList(params: ReqList<AccessorieCategory>) {
      try {
        const { data } = await https.post<ResList<AccessorieCategory>, ReqList<AccessorieCategory>>('/product/accessorie/category/list', params)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.categoryListTotal = data.value.data.total
          this.categoryList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    // 获取配件条目筛选列表
    async getAccessorieCategoryWhere() {
      try {
        const { data } = await https.get<Where<AccessorieCategory>>('/product/accessorie/category/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.categoryFilterList = data.value.data
          this.categoryFilterListToArray = sortArr(this.categoryFilterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 新增配件条目
    async addAccessorieCategory(params: { list: AccessorieCategory[] }) {
      try {
        const { data } = await https.post<any, { list: AccessorieCategory[] }>('/product/accessorie/category/create', params)
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
  },
})
