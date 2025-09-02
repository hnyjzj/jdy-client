export const useStock = defineStore('Stock', {
  state: () => ({
    filterList: {} as Where<{ type: number }>,
    title: [] as StockTitle[],
    stockList: [] as any[],

    oldfilterList: {} as Where<{ type: number }>,
    oldtitle: [] as StockTitle[],
    oldstockList: [] as any[],

    RevenueWhere: {} as Where<Revenue>,
    RevenueTitle: [] as Revenue[],
    RevenueList: [] as any[],

    // 成品销售
    finishedSalesFilterList: {} as Where<{ type: number }>,
    finishedSalesTitle: [] as StockTitle[],
    finishedSalesList: [] as any[],
    // 旧料销售
    oldSalesFilterList: {} as Where<{ type: number }>,
    oldSalesTitle: [] as StockTitle[],
    oldSalesList: [] as any[],
  }),
  getters: {

  },
  actions: {
    /**
     * 获取成品库存类型
     */
    async getStockType() {
      const { data } = await https.get<Where<{ type: number }>>('/statistic/boos/finished_stock/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.filterList = data.value?.data
      }
    },
    /**
     * 获取成品库存标题
     */
    async getStockTitle() {
      const { data } = await https.get<StockTitle[]>('/statistic/boos/finished_stock/title')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.title = data.value?.data
      }
    },
    /**
     * 获取成品库存列表
     */
    async getStockList(params: { type: number }) {
      const { data } = await https.post<any, { type: number }>('/statistic/boos/finished_stock/data', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.stockList = data.value?.data
      }
    },

    /**
     * 获取旧料库存类型
     */
    async OldGetStockType() {
      const { data } = await https.get<Where<{ type: number }>>('/statistic/boos/old_stock/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldfilterList = data.value?.data
      }
    },
    /**
     * 获取旧料库存标题
     */
    async OldGetStockTitle() {
      const { data } = await https.get<StockTitle[]>('/statistic/boos/old_stock/title')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldtitle = data.value?.data
      }
    },
    /**
     * 获取旧料库存列表
     */
    async OldGetStockList(params: { type: number }) {
      const { data } = await https.post<any, { type: number }>('/statistic/boos/old_stock/data', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldstockList = data.value?.data
      }
    },
    /**
     * 获取收支统计类型
     */
    async getRevenueWhere() {
      const { data } = await https.get<Where<Revenue>>('/statistic/boos/payments/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.RevenueWhere = data.value?.data
      }
    },
    /**
     * 获取收支统计列表
     */
    async getRevenueList(params: Revenue) {
      const { data } = await https.post<any, Revenue>('/statistic/boos/payments/data', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.RevenueList = data.value?.data
      }
    },
    /**
     * 获取收支统计标题
     */
    async getRevenueTitle() {
      const { data } = await https.get<Revenue[]>('/statistic/boos/payments/title')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.RevenueTitle = data.value?.data
      }
    },

    /**
     * 获取成品销售类型
     */
    async getFinishedSalesType() {
      const { data } = await https.get<Where<{ type: number }>>('/statistic/boos/finished_sales/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.finishedSalesFilterList = data.value?.data
      }
    },
    /**
     * 获取成品销售标题
     */
    async getFinishedSalesTitle() {
      const { data } = await https.get<StockTitle[]>('/statistic/boos/finished_sales/title')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.finishedSalesTitle = data.value?.data
      }
    },
    /**
     * 获取成品销售列表
     */
    async getFinishedSalesList(params: { type: number }) {
      const { data } = await https.post<any, { type: number }>('/statistic/boos/finished_sales/data', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.finishedSalesList = data.value?.data
      }
    },

    /**
     * 获取旧料销售类型
     */
    async getOldSalesType() {
      const { data } = await https.get<Where<{ type: number }>>('/statistic/boos/old_sales/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldSalesFilterList = data.value?.data
      }
    },
    /**
     * 获取旧料销售标题
     */
    async getOldSalesTitle() {
      const { data } = await https.get<StockTitle[]>('/statistic/boos/old_sales/title')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldSalesTitle = data.value?.data
      }
    },
    /**
     * 获取旧料销售列表
     */
    async getOldSalesList(params: { type: number }) {
      const { data } = await https.post<any, { type: number }>('/statistic/boos/old_sales/data', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldSalesList = data.value?.data
      }
    },

  },

})
