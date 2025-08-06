export const useDepositOrder = defineStore('depositOrder', {
  state: () => ({
    OrdersList: [] as DepositOrderInfo[],
    filterList: {} as Where<DepositOrderWhere>,
    total: 0 as number,
    OrderDetail: {} as DepositOrderInfo,
    filterListToArray: [] as FilterWhere<DepositOrderWhere>[],
    oldFilterList: {} as Where<ProductOld>,
    oldFilterListToArray: {} as FilterWhere<ProductOld>[],
    showtype: 'list' as 'list' | 'table',
  }),

  actions: {
    // 获取筛选条件
    async getSaleWhere() {
      const { data } = await https.get<Where<DepositOrderWhere>, null>('/order/deposit/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.filterList = data.value.data
        this.filterListToArray = sortArr(this.filterList)
      }
    },
    // 获取订单详情
    async getOrderDetail(req: { id: string }) {
      const { data } = await https.post<DepositOrderInfo, { id: string }>('/order/deposit/info', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.OrderDetail = data.value.data
        return true
      }
    },
    // 新增定金单
    async submitDepositOrder(req: DepositOrder) {
      const { data } = await https.post<DepositOrderInfo, DepositOrder>('/order/deposit/create', req)
      return data.value
    },
    // 获取订金单列表
    async getDepositList(req: ReqList<DepositOrderInfo>) {
      if (req.page === 1) {
        this.OrdersList = []
      }
      const { data } = await https.post<ResList<DepositOrderInfo>, ReqList<DepositOrderInfo>>('/order/deposit/list', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.total = data.value.data.total
        if (data.value.data.list !== null && data.value.data.list.length > 0) {
          this.OrdersList = data.value.data.list
          if (this.OrdersList.length === this.total) {
            return false
          }
          return true
        }
        else {
          this.OrdersList = []
          // 当前页没有数据，则不进行下一页
          return false
        }
      }
    },
    /**
     * 支付订金单
     * @params id 订金单id
     */
    async payDepositOrder(req: { id: string }) {
      const { data } = await https.put<any, { id: string }>('/order/deposit/pay', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      return false
    },
    /**
     * 撤销订金单
     * @params id 订金单id
     * @returns true or false
     */
    async rovkeDepositOrder(req: { id: string }) {
      const { data } = await https.put<any, { id: string }>('/order/deposit/revoked', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      return false
    },
    /**
     * 订金单退货
     */
    async returnGoodsDepositOrder(req: DepositReturnGoods) {
      const { data } = await https.put<any, DepositReturnGoods>('/order/deposit/refund', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      return false
    },
    async isStoreStaff(params: { id: string, staff_id?: string }) {
      const { data } = await https.post<any, { id: string }>('/store/staff/is_in', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        return data.value?.data
      }
      return false
    },
    // 是否是门店负责人
    async isSuperior(params: { id: string, staff_id?: string }) {
      const { data } = await https.post<any, { id: string }>('/superior/is_in', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        return data.value?.data
      }
      return false
    },

  },
})
