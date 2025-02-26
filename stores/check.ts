export const useCheck = defineStore('check', {
  state: (): {
    checkList: Check[]
    checkFilterListToArray: FilterWhere<Check>[]
    checkFilterList: Where<Check>
    checkTotal: number
    checkInfo: CheckInfo
  } => ({
    checkList: [],
    checkFilterListToArray: [] as FilterWhere<Check>[],
    checkFilterList: {} as Where<Check>,
    checkTotal: 0,
    checkInfo: {} as CheckInfo,
  }),
  actions: {
    // 盘带单列表
    async getCheckList(pamars: ReqList<Check>) {
      try {
        const { data } = await https.post<ResList<Check>, ReqList<Check>>('/product/inventory/list', pamars)
        if (data.value.code === HttpCode.SUCCESS) {
          this.checkTotal = data.value.data.total

          if (pamars.page === 1) {
            this.checkList = data.value.data.list
          }
          else {
            this.checkList = this.checkList.concat(data.value.data.list)
          }
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取盘点单筛选
    async getCheckWhere() {
      try {
        const { data } = await https.get<Where<Check>>('/product/inventory/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.checkFilterList = data.value.data
          this.checkFilterListToArray = sortArr(data.value.data)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    /** 创建盘点单 */
    async createCheck(params: Check) {
      try {
        const { data } = await https.post<Check, any >('/product/inventory/create', params)
        return data.value
      }
      catch (error) {
        throw new Error(`创建失败: ${error || '未知错误'}`)
      }
    },
    /** 盘点单详情 */
    async getCheckInfo(id: string, product_status: number) {
      try {
        const { data } = await https.post<CheckInfo, { id: string, product_status: number }>('/product/inventory/info', { id, product_status })
        if (data.value.code === HttpCode.SUCCESS) {
          this.checkInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    /** 更改盘点单状态 */
    async changeCheckStatus(id: Check['id'], status: Check['status']) {
      try {
        const { data } = await https.put<{ id: string, status: string }, any >('/product/inventory/change', { id, status })
        return data.value
      }
      catch (error) {
        throw new Error(`更改失败: ${error || '未知错误'}`)
      }
    },
  },
})
