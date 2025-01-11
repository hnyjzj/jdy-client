export const useEnter = defineStore('EnterStore', {
  state: (): {
    EnterList: Enter[]
    filterList: Where<Enter>
    EnterInfo: Enter
    EnterListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    EnterToArray: FilterWhere<Enter>[]
  } => ({
    filterList: {} as Where<Enter>,
    EnterList: [],
    EnterInfo: {} as Enter,
    EnterListTotal: 0,
    EnterToArray: {} as FilterWhere<Enter>[],
  }),
  actions: {
    // 货品列表
    async getEnterList(pamars: ReqList<Enter>) {
      try {
        const { data } = await https.post<ResList<Enter>, ReqList<Enter>>('/product/enter/list', pamars)
        if (data.value.code === HttpCode.SUCCESS) {
          this.EnterListTotal = data.value.data.total
          if (pamars.page === 1) {
            this.EnterList = data.value.data.list
          }
          else {
            this.EnterList = this.EnterList.concat(data.value.data.list)
          }
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取筛选列表
    async getEnterWhere() {
      try {
        const { data } = await https.get<Where<Enter>>('/product/enter/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          console.log(data.value.data)

          this.filterList = data.value.data
          this.EnterToArray = sortArr(this.filterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 更新货品
    async updateEnterInfo(pamars: Partial<Enter>) {
      try {
        const { data } = await https.put<Enter, Partial<Enter>>('/Enter/update', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`更新失败: ${error || '未知错误'}`)
      }
    },
  },
})
