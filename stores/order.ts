export const useOrder = defineStore('Order', {
  state: () => ({
    OrdersList: [] as Orders[], // 门店列表
    filterList: {} as Where<Orders>,
    todayPrice: '' as string,
    total: 0 as number,
    OrderDetail: {} as Orders,
  }),
  getters: {
    filterListToArray: (state) => {
      const arr: FilterWhere<Orders>[] = []
      for (const [_k, item] of Object.entries(state.filterList)) {
        arr.push({
          ...item,
        })
      }
      return arr.sort((a, b) => a.sort - b.sort)
    },

  },
  actions: {
    // 获取筛选条件
    async getSaleWhere() {
      const { data } = await https.get<Where<Orders>, null>('/order/where')
      if (data.value.code === HttpCode.SUCCESS) {
        this.filterList = data.value.data
      }
    },
    async getOrderList(req: ReqList<Orders>) {
      if (req.page === 1) {
        this.OrdersList = []
      }
      const { data } = await https.post<ResList<Orders>, ReqList<Orders>>('/order/list', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.total = data.value.data.total
        if (data.value.data.list.length > 0) {
          this.OrdersList = [...this.OrdersList, ...data.value.data.list]
          if (this.OrdersList.length === this.total) {
            return false
          }
          return true
        }
        else {
          // 当前页没有数据，则不进行下一页
          return false
        }
      }
    },
    // 获取今日金价
    async getTodayPrice() {
      const { data } = await https.get<any, null>('/setting/gold_price/get')
      if (data.value.code === HttpCode.SUCCESS) {
        this.todayPrice = data.value.data.price
      }
    },
    // 提交订单
    async submitOrder(req: Orders) {
      const { data } = await https.post<undefined, Orders>('/order/create', req)
      return data.value
    },
    async getOrderDetail(req: { id: string }) {
      const { data } = await https.post<Orders, { id: string }>('/order/info', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.OrderDetail = data.value.data
      }
    },
  },
})
