export const useEnter = defineStore('EnterStore', {
  state: (): {
    EnterList: Enter[]
    enterFilterList: Where<Enter>
    EnterListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    EnterToArray: FilterWhere<Enter>[]
    enterInfo: Enter
  } => ({
    enterFilterList: {} as Where<Enter>,
    EnterList: [],
    EnterListTotal: 0,
    EnterToArray: {} as FilterWhere<Enter>[],
    enterInfo: {} as Enter,
  }),
  actions: {
    // 入库单列表
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
          this.enterFilterList = data.value.data
          this.EnterToArray = sortArr(this.enterFilterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 新增入库单
    async addEnter(pamars: Product) {
      try {
        const { data } = await https.post<Enter, Product>('/product/enter/create', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`新增入库失败: ${error || '未知错误'}`)
      }
    },
    // 获取入库单详情
    async getEnterInfo(id: Enter['id']) {
      try {
        const { data } = await https.post<Enter, { id: Enter['id'] }>('/product/enter/info', { id })
        if (data.value.code === HttpCode.SUCCESS) {
          this.enterInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取入库单详情失败: ${error || '未知错误'}`)
      }
    },
  },
})
