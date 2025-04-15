export const useAcessorieRecord = defineStore('AcessorieRecord', {
  state: (): {
    /** 记录列表 */
    productRocordList: AccessorieRecord[]
    /** 记录筛选列表 */
    historyFilterList: Where<AccessorieRecord>
    /** 排序后记录筛选列表 */
    HistoryFilterListToArray: FilterWhere<AccessorieRecord>[]
    /** 操作记录列表总数 */
    historyListTotal: number
    historyInfo: AccessorieRecord
  } => ({
    productRocordList: [],
    historyFilterList: {} as Where<AccessorieRecord>,
    HistoryFilterListToArray: [] as FilterWhere<AccessorieRecord>[],
    historyListTotal: 0,
    historyInfo: {} as AccessorieRecord,
  }),
  actions: {
    /** 货品记录 */
    async getProductHistory(params: ReqList<HistoryWhere>) {
      try {
        params = { ...params, where: { ...params.where } }
        const { data } = await https.post<ResList<AccessorieRecord>, ReqList<HistoryWhere>>('/product/history/list', params)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.historyListTotal = data.value.data.total
          this.productRocordList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品记录失败: ${error || '未知错误'}`)
      }
    },
    // 货品记录详情
    async getProductHistoryInfo(id: AccessorieRecord['id']) {
      try {
        const { data } = await https.post<AccessorieRecord, { id: AccessorieRecord['id'] }>('/product/history/info', { id })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.historyInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    // 获取记录筛选列表
    async getHistoryWhere() {
      try {
        const { data } = await https.get<Where<AccessorieRecord>>('/product/history/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.historyFilterList = data.value.data
          this.HistoryFilterListToArray = sortArr(this.historyFilterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 上传产品图
    async uploadProductImg(req: UploadProductImg) {
      try {
        const { data } = await https.upload<UploadRes, UploadProductImg>('/upload/product', req)
        return data.value
      }
      catch (error) {
        throw new Error(`上传产品图片失败: ${error || '未知错误'}`)
      }
    },
  },
})
