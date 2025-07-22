export const useStatement = defineStore('statement', {
  state: () => ({
    statementList: [] as orderInfoProducts[],
    statementReturnList: [] as StatementRefundInfo[],
    total: 0 as number,
    statementRetrunListTotal: 0 as number,
    filterList: {} as Where<StatementWhere>,
    filterListToArray: [] as FilterWhere <StatementWhere> [],
    ReturnfilterList: {} as Where<StatementRefundWhere>,
    ReturnfilterListToArray: [] as FilterWhere<StatementRefundWhere>[],

    showtype: 'list' as 'list' | 'table',
  }),
  actions: {
    /**
     *获取销售明细列表
     */
    async getStatementList(pamars: ReqList<orderInfoProducts>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<orderInfoProducts>, ReqList<orderInfoProducts>>('/order/sales/detail/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.total = data.value.data.total
          this.statementList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    /**
     * 获取销售明细筛选条件
     *
     */
    async getStatementWhere() {
      try {
        const { data } = await https.get<Where<StatementWhere>>('/order/sales/detail/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.filterList = data.value.data
          this.filterListToArray = sortArr(this.filterList)
        }
        return data.value?.data || {}
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },

    /**
     * 获取退货明细where条件
     */
    async getReturnWhere() {
      try {
        const { data } = await https.get<Where<StatementRefundWhere>>('/order/sales/refund/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.ReturnfilterList = data.value.data
          this.ReturnfilterListToArray = sortArr(this.ReturnfilterList)
        }
        return data.value?.data || {}
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    /**
     * 获取退货明细列表
     */
    async getReturnList(pamars: ReqList<StatementRefundInfo>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<StatementRefundInfo>, ReqList<StatementRefundInfo>>('/order/sales/refund/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.statementRetrunListTotal = data.value.data.total
          this.statementReturnList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
  },
})
