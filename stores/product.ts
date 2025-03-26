export const useProductManage = defineStore('ProductManage', {
  state: (): {
    /** 记录列表 */
    productRocordList: ProductHistories[]
    /** 记录筛选列表 */
    historyFilterList: Where<ProductHistories>
    /** 排序后记录筛选列表 */
    HistoryFilterListToArray: FilterWhere<ProductHistories>[]
    /** 操作记录列表总数 */
    historyListTotal: number
    historyInfo: ProductHistories
  } => ({
    productRocordList: [],
    historyFilterList: {} as Where<ProductHistories>,
    HistoryFilterListToArray: {} as FilterWhere<ProductHistories>[],
    historyListTotal: 0,
    historyInfo: {} as ProductHistories,
  }),
  actions: {
    /** 货品记录 */
    async getProductHistory(pamars: ReqList<HistoryWhere>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<ProductHistories>, ReqList<HistoryWhere>>('/product/history/list', pamars)
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
    async getProductHistoryInfo(id: ProductHistories['id']) {
      try {
        const { data } = await https.post<ProductHistories, { id: ProductHistories['id'] }>('/product/history/info', { id })
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
        const { data } = await https.get<Where<ProductHistories>>('/product/history/where')
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
