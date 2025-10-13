export const useBoss = defineStore('boss', {
  state: () => ({
    // 成品库存
    finishedWhere: {} as Where<BossWhere>,
    finishedTitle: [] as StockTitle[],
    stockList: [] as BossSalesList[],
    // 旧料库存
    oldfilterWhere: {} as Where<BossWhere>,
    oldtitle: [] as StockTitle[],
    oldstockList: [] as BossSalesList[],
    // 收支统计
    RevenueWhere: {} as Where<BossWhere>,
    RevenueTitle: [] as StockTitle[],
    RevenueList: [] as BossSalesList[],
    // 成品销售
    finishedSalesWhere: {} as Where<BossWhere>,
    finishedSalesTitle: [] as StockTitle[],
    finishedSalesList: [] as BossSalesList[],
    // 旧料销售
    oldSalesFilterWhere: {} as Where<BossWhere>,
    oldSalesTitle: [] as StockTitle[],
    oldSalesList: [] as BossSalesList[],
    // 旧料回收
    oldRecycleFilterWhere: {} as Where<BossWhere>,
    oldRecycleTitle: [] as StockTitle[],
    oldRecycleList: [] as BossSalesList[],

    // performance
    performanceWhere: {} as Where<BossWhere>,
    performanceTitle: [] as StockTitle[],
    performanceList: [] as BossSalesList[],
    // 时间where
    timeWhere: {} as Where<BossWhere>,
  }),
  getters: {

  },
  actions: {
    /**
     * 生成表格标题配置（公共函数）
     * @param dataList 数据列表
     * @returns 去重后的标题配置数组
     */
    generateTableTitle(dataList: BossSalesList[]): StockTitle[] {
      const resultSet = new Set<string>()
      const result: StockTitle[] = []

      if (dataList.length > 0) {
        for (const item of dataList) {
          Object.keys(item).forEach((key) => {
            const title = key === 'name' ? '门店' : (key === 'total' ? '合计' : key)
            if (!resultSet.has(title)) {
              resultSet.add(title)
              result.push({
                title,
                key,
                width: '90px',
                align: 'center',
                fixed: (key === 'name') || (key === 'total') ? 'left' : '',
              })
            }
          })
        }
        // 对优先项进行排序：name优先级最高，total第二
        result.sort((a, b) => {
          if (a.key === 'name')
            return -1
          if (b.key === 'name')
            return 1
          if (a.key === 'total')
            return -1
          if (b.key === 'total')
            return 1
          return 0
        })
      }
      return result
    },

    /**
     * 获取公共where
     */
    async getPublicWhere() {
      const { data } = await https.get<Where<BossWhere>>('/statistic/boos/where', undefined, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.timeWhere = data.value?.data
      }
    },

    /**
     * 获取成品库存类型
     */
    async getStockType() {
      const { data } = await https.get<Where<BossWhere>>('/statistic/boos/finished_stock/where', undefined, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.finishedWhere = data.value?.data
      }
    },

    /**
     * 获取成品库存列表
     */
    async getStockList(params: BossWhere) {
      const { data } = await https.post<any, BossWhere>('/statistic/boos/finished_stock/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.stockList = data.value?.data
        // 使用公共函数生成标题配置
        this.finishedTitle = this.generateTableTitle(this.stockList)
      }
      return { list: this.stockList, title: this.finishedTitle }
    },

    /**
     * 获取旧料库存类型
     */
    async OldGetStockType() {
      const { data } = await https.get<Where<BossWhere>>('/statistic/boos/old_stock/where', undefined, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldfilterWhere = data.value?.data
      }
    },

    /**
     * 获取旧料库存列表
     */
    async OldGetStockList(params: BossWhere) {
      const { data } = await https.post<any, BossWhere>('/statistic/boos/old_stock/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldstockList = data.value?.data
        // 使用公共函数生成标题配置
        this.oldtitle = this.generateTableTitle(this.oldstockList)
      }
      return { list: this.oldstockList, title: this.oldtitle }
    },
    /**
     * 获取收支统计类型
     */
    async getRevenueWhere() {
      const { data } = await https.get<Where<BossWhere>>('/statistic/boos/payments/where', undefined, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.RevenueWhere = data.value?.data
      }
    },
    /**
     * 获取收支统计列表
     */
    async getRevenueList(params: BossWhere) {
      const { data } = await https.post<any, BossWhere>('/statistic/boos/payments/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.RevenueList = data.value?.data
        // 使用公共函数生成标题配置
        this.RevenueTitle = this.generateTableTitle(this.RevenueList)
      }
      return { list: this.RevenueList, title: this.RevenueTitle }
    },

    /**
     * 获取成品销售类型
     */
    async getFinishedSalesType() {
      const { data } = await https.get<Where<BossWhere>>('/statistic/boos/finished_sales/where', undefined, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.finishedSalesWhere = data.value?.data
      }
    },

    /**
     * 获取成品销售列表
     */
    async getFinishedSalesList(params: BossWhere) {
      const { data } = await https.post<any, BossWhere>('/statistic/boos/finished_sales/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.finishedSalesList = data.value?.data
        // 使用公共函数生成标题配置
        this.finishedSalesTitle = this.generateTableTitle(this.finishedSalesList)
      }
      return { list: this.finishedSalesList, title: this.finishedSalesTitle }
    },

    /**
     * 获取旧料销售类型
     */
    async getOldSalesType() {
      const { data } = await https.get<Where<BossWhere>>('/statistic/boos/old_exchange/where', undefined, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldSalesFilterWhere = data.value?.data
      }
    },

    /**
     * 获取旧料兑换列表
     */
    async getOldSalesList(params: BossWhere) {
      const { data } = await https.post<any, BossWhere>('/statistic/boos/old_exchange/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldSalesList = data.value?.data
        // 使用公共函数生成标题配置
        this.oldSalesTitle = this.generateTableTitle(this.oldSalesList)
      }
      return { list: this.oldSalesList, title: this.oldSalesTitle }
    },
    /**
     * 获取旧料回收类型
     */
    async getOldRecycleType() {
      const { data } = await https.get<Where<BossWhere>>('/statistic/boos/old_recycle/where', undefined, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldRecycleFilterWhere = data.value?.data
      }
    },

    /**
     * 获取旧料回收列表
     */
    async getOldRecycleList(params: BossWhere) {
      const { data } = await https.post<any, BossWhere>('/statistic/boos/old_recycle/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldRecycleList = data.value?.data
        // 使用公共函数生成标题配置
        this.oldRecycleTitle = this.generateTableTitle(this.oldRecycleList)
      }
      return { list: this.oldRecycleList, title: this.oldRecycleTitle }
    },

    async getPerformanceType() {
      const { data } = await https.get<Where<BossWhere>>('/statistic/boos/performance/where', undefined, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.performanceWhere = data.value?.data
      }
    },
    /**
     * 业绩列表
     */
    async getPerformanceList(params: BossWhere) {
      this.performanceList = []
      const { data } = await https.post<any, BossWhere>('/statistic/boos/performance/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.performanceList = data.value?.data
        this.performanceTitle = this.generateTableTitle(this.performanceList)
      }
      return { list: this.performanceList, title: this.performanceTitle }
    },

  },

})
