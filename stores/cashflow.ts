export const useCashflow = defineStore('cashflow', {
  state: () => ({
    // 收支数据
    casflowWhere: {} as Where<CashflowWhere>,
    casflowTitle: [] as StockTitle[],
    casflowList: [] as BossSalesList[],
    // 时间where
    timeWhere: {} as Where<CashflowWhere>,
    overview: {} as Record<string, string>,

    sourceTitle: [] as StockTitle[],
    sourceList: [] as Record<string, string>[],
  }),
  getters: {

  },
  actions: {
    /**
     * 将现金流Record对象转换为数组格式
     * @param recordData Record格式的现金流数据
     * @returns 转换后的数组格式数据
     */
    convertCashflowRecordToArray(recordData: CashflowList): BossSalesList[] {
      return Object.entries(recordData).map(([paymentMethod, cashflowData]) => ({
        name: paymentMethod,
        ...cashflowData,
      }))
    },
    /**
     * 生成表格标题配置（公共函数）
     * @param dataList 数据列表
     * @returns 去重后的标题配置数组
     */
    generateTableTitle(dataList: any[]): StockTitle[] {
      const resultSet = new Set<string>()
      const result: StockTitle[] = []

      if (dataList.length > 0) {
        const firstItem = dataList[0]
        Object.keys(firstItem).forEach((key) => {
          const title = key === 'name' ? '支付方式' : key
          if (!resultSet.has(title)) {
            resultSet.add(title)
            result.push({
              title,
              key,
              width: '90px',
              align: 'center',
              fixed: key === 'name' ? 'left' : '',
            })
          }
        })

        // 对优先项进行排序：name优先级最高，total第二
        result.sort((a, b) => {
          if (a.key === 'name')
            return -1
          if (b.key === 'name')
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
      const { data } = await https.get<Where<CashflowWhere>>('/statistic/payment/where', undefined, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.timeWhere = data.value?.data
      }
    },

    async getCashflowList(params: CashflowWhere) {
      this.sourceTitle = []
      const { data } = await https.post<{ list: CashflowList, overview: Record<string, string>, detail_title: string[], details: Record<string, string>[] }, CashflowWhere>('/statistic/payment/data', params, true, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.casflowList = this.convertCashflowRecordToArray(reorderObject(data.value?.data?.list))
        this.casflowTitle = this.generateTableTitle(this.casflowList)
        this.overview = reorderObject(data.value?.data?.overview)
        this.sourceTitle = data.value?.data?.detail_title.map(item => ({
          title: item,
          key: item,
          width: '90px',
          align: 'center',
        })) ?? []
      }
      return {
        title: this.casflowTitle,
        list: this.casflowList,
        sourceTitle: this.sourceTitle,
        sourceList: data.value?.data?.details,
      }
    },

  },

})
