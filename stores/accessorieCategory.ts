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
    categoryFilterListToArray: {} as FilterWhere<AccessorieCategory>[],
  }),
  actions: {
    // 配件条目
    async getAccessorieCategoryList(params: ReqList<AccessorieCategory>) {
      try {
        const { data } = await https.post<AccessorieCategory[], ReqList<AccessorieCategory>>('/product/accessorie/category/list', params)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.categoryListTotal = data.value.data.length
          this.categoryList = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    // 获取配件筛选列表
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
    async AddAccessorieCategory(params: AccessorieCategory) {
      console.log(11)

      console.log(1111111, params)

      try {
        console.log(1111111, params)

        const { data } = await https.post<any, AccessorieCategory>('/product/accessorie/category/create', params)
        if (data.value?.code === HttpCode.SUCCESS) {
          return data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
  },
})
