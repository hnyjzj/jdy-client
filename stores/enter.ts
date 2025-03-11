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
    // 获取入库单列表
    async getEnterList(pamars: ReqList<Enter>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<Enter>, ReqList<Enter>>('/product/enter/list', pamars)
        if (data.value.code === HttpCode.SUCCESS) {
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
    /** 添加入库单 */
    async createProductEnter(params: CreateProductEnter) {
      try {
        const { data } = await https.post<any, CreateProductEnter>('/product/enter/create', params)
        return data.value
      }
      catch (error) {
        throw new Error(`添加入库单失败: ${error || '未知错误'}`)
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
    // 删除入库单产品
    async delEnterProduct(params: DelEnterProduct) {
      try {
        const { data } = await https.delete<any, DelEnterProduct>('/product/enter/del_product', params)
        return data.value
      }
      catch (error) {
        throw new Error(`删除入库单产品失败: ${error || '未知错误'}`)
      }
    },
  },
})
