export const useProductManage = defineStore('ProductManage', {
  state: (): {
    productList: Product[]
    filterList: Where<Product>
    productInfo: Product
    productListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    filterListToArray: FilterWhere<Product>[]
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
    filterList: {} as Where<Product>,
    productList: [],
    productInfo: {} as Product,
    productListTotal: 0,
    filterListToArray: {} as FilterWhere<Product>[],
    productRocordList: [],
    historyFilterList: {} as Where<ProductHistories>,
    HistoryFilterListToArray: {} as FilterWhere<ProductHistories>[],
    historyListTotal: 0,
    historyInfo: {} as ProductHistories,
  }),
  actions: {
    // 货品列表
    async getProductList(pamars: ReqList<Product>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<Product>, ReqList<Product>>('/product/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.productListTotal = data.value.data.total
          this.productList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },

    // 货品导入
    async importProduct(params: inportReq) {
      try {
        const { data } = await https.post<any, inportReq>('/product/enter/create', params)
        return data.value
      }
      catch (error) {
        throw new Error(`货品导入失败: ${error || '未知错误'}`)
      }
    },
    // 获取筛选列表
    async getProductWhere(params: { type: Product['type'] } = { type: 1 }) {
      try {
        const { data } = await https.post<Where<Product>, { type: Product['type'] }>('/product/where', params)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.filterList = data.value.data
          this.filterListToArray = sortArr(this.filterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 货品详情
    async getProductInfo(code: Product['code']) {
      try {
        const { data } = await https.post<Product, { code: Product['code'] }>('/product/info', { code })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.productInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    // 更新货品
    async updateProductInfo(pamars: Partial<Product>) {
      try {
        const { data } = await https.put<Product, Partial<Product>>('/product/update', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`更新失败: ${error || '未知错误'}`)
      }
    },
    // 报损
    async damageProduct(pamars: ProductDamage) {
      try {
        const { data } = await https.put<any, ProductDamage>('/product/damage', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`报损失败: ${error || '未知错误'}`)
      }
    },
    // 转换
    async convertProduct(pamars: ProductTransfer) {
      try {
        const { data } = await https.put<any, ProductTransfer>('/product/conversion', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`转换失败: ${error || '未知错误'}`)
      }
    },
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
