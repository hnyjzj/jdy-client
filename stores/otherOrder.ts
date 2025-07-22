export const useOtherOrder = defineStore('OtherOrder', {
  state: () => ({
    filterList: {} as Where<otherOrderWhere>,
    total: 0 as number,
    filterListToArray: [] as FilterWhere<otherOrderWhere>[],
    orderList: [] as otherOrderInfo[],
    otherOrderDetail: {} as otherOrderInfo,
    showtype: 'list' as 'list' | 'table',
  }),

  actions: {
    /**
     * 获取其他收支单单筛选条件
     * @return filterList
     */
    async otherOrderWhere() {
      const { data } = await https.get<Where<otherOrderWhere>, null>('/order/other/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.filterList = data.value.data
        this.filterListToArray = sortArr(this.filterList)
      }
    },

    /**
     * 新增其他收支单
     */
    async addOtherOrder(req: otherOrderCreate) {
      const { data } = await https.post<any, otherOrderCreate>('/order/other/create', req)
      return data
    },
    /**
     *  获取其他收支单列表
     */
    async getOtherOrderList(req: ReqList<otherOrderInfo>) {
      const { data } = await https.post<ResList<otherOrderInfo>, ReqList<otherOrderInfo>>('/order/other/list', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.total = data.value.data.total
        this.orderList = data.value.data.list
      }
    },
    /**
     * 获取其他收支单详情
     */
    async getOtherOrderDetail(req: { id: string }) {
      const { data } = await https.post<otherOrderInfo, { id: string }>('/order/other/info', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.otherOrderDetail = data.value.data
      }
    },
    /**
     * 修改其他收支单
     */
    async updateOtherOrder(req: otherOrderCreate) {
      const { data } = await https.put<any, otherOrderCreate>('/order/other/update', req)
      return data
    },

    /**
     * 删除其他收支单
     */
    async  delOtherOrder(req: { id: string }) {
      const { data } = await https.delete<any, { id: string }>('/order/other/delete', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
    },
  },
})
