export const useOrder = defineStore('Order', {
  state: () => ({
    OrdersList: [] as Orders[], // 门店列表
    filterList: {} as Where<OrderWhere>,
    todayPrice: '' as string,
    total: 0 as number,
    OrderDetail: {} as Orders,
    filterListToArray: [] as FilterWhere<OrderWhere>[],
    searchPage: 1 as number, // 订单列表页面搜索页数
    oldFilterList: {} as Where<Product>,
    oldFilterListToArray: [] as FilterWhere<Product>[],
  }),

  actions: {
    // 获取筛选条件
    async getSaleWhere() {
      const { data } = await https.get<Where<OrderWhere>, null>('/order/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.filterList = data.value.data
        this.filterListToArray = sortArr(this.filterList)
      }
    },
    //  获取旧料的新增条件
    async OldMaterialsWhere() {
      const { data } = await https.get<Where<Product>, null>('/product/where_product_old')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldFilterList = data.value.data
        this.oldFilterListToArray = sortArr(this.oldFilterList)
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
          this.OrdersList = data.value.data.list
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
      if (data.value?.code === HttpCode.SUCCESS) {
        this.todayPrice = data.value.data.price
      }
    },
    // 提交订单
    async submitOrder(req: Orders) {
      const { data } = await https.post<Orders, Orders>('/order/create', req)
      return data.value
    },
    async getOrderDetail(req: { id: string }) {
      const { data } = await https.post<Orders, { id: string }>('/order/info', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.OrderDetail = data.value.data
        return true
      }
    },
  },
})
