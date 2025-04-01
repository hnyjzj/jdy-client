export const useFinishedEnter = defineStore('finishedEnter', {
  state: (): {
    EnterList: FinishedEnter[]
    enterFilterList: Where<FinishedEnter>
    EnterListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    EnterToArray: FilterWhere<FinishedEnter>[]
    enterInfo: FinishedEnter
  } => ({
    enterFilterList: {} as Where<FinishedEnter>,
    EnterList: [],
    EnterListTotal: 0,
    EnterToArray: {} as FilterWhere<FinishedEnter>[],
    enterInfo: {} as FinishedEnter,
  }),
  actions: {
    // 获取入库单列表
    async getFinishedEnterList(params: ReqList<FinishedEnter>) {
      try {
        params = { ...params, where: { ...params.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<FinishedEnter>, ReqList<FinishedEnter>>('/product/finished/enter/list', params)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.EnterListTotal = data.value.data.total
          this.EnterList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取入库单筛选列表
    async getFinishedEnterWhere() {
      try {
        const { data } = await https.get<Where<FinishedEnter>>('/product/finished/enter/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.enterFilterList = data.value.data
          this.EnterToArray = sortArr(this.enterFilterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    /** 添加入库单 */
    async createFinishedEnter(params: CreateProductFinsihedEnter) {
      try {
        const { data } = await https.post<any, CreateProductFinsihedEnter>('/product/finished/enter/create', params)
        return data.value
      }
      catch (error) {
        throw new Error(`添加入库单失败: ${error || '未知错误'}`)
      }
    },
    /** 添加入库单产品 */
    async addFinishedEnter(params: FinishedEnterReq) {
      try {
        const { data } = await https.post<any, FinishedEnterReq>('/product/finished/enter/add_product', params)
        return data.value
      }
      catch (error) {
        throw new Error(`货品导入失败: ${error || '未知错误'}`)
      }
    },
    /** 编辑入库单产品 */
    async editFinishedEnter(params: editFinishedEnterReq) {
      try {
        const { data } = await https.put<any, editFinishedEnterReq>('/product/finished/enter/edit_product', params)
        return data.value
      }
      catch (error) {
        throw new Error(`编辑失败: ${error || '未知错误'}`)
      }
    },
    // 获取入库单详情
    async getFinishedEnterInfo(id: FinishedEnter['id']) {
      try {
        const { data } = await https.post<FinishedEnter, { id: FinishedEnter['id'] }>('/product/finished/enter/info', { id })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.enterInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取入库单详情失败: ${error || '未知错误'}`)
      }
    },
    // 删除入库单产品
    async delFinishedEnter(params: DelProductFinishedEnter) {
      try {
        const { data } = await https.delete<any, DelProductFinishedEnter>('/product/finished/enter/del_product', params)
        return data.value
      }
      catch (error) {
        throw new Error(`删除入库单产品失败: ${error || '未知错误'}`)
      }
    },
    // 取消入库
    async cancelFinishedEnter(enter_id: FinishedEnter['id']) {
      try {
        const { data } = await https.put<any, { enter_id: FinishedEnter['id'] }>('/product/finished/enter/cancel', { enter_id })
        return data.value
      }
      catch (error) {
        throw new Error(`取消入库失败: ${error || '未知错误'}`)
      }
    },
    // 完成入库
    async successFinishedEnter(enter_id: FinishedEnter['id']) {
      try {
        const { data } = await https.put<any, { enter_id: FinishedEnter['id'] }>('/product/finished/enter/finish', { enter_id })
        return data.value
      }
      catch (error) {
        throw new Error(`完成入库失败: ${error || '未知错误'}`)
      }
    },
  },
})
