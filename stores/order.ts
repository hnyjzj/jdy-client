export const useOrder = defineStore('Order', {
  state: () => ({
    OrdersList: [] as Orders[], // 门店列表
    filterList: {} as Where<OrderWhere>,
    todayPrice: '' as string,
    total: 0 as number,
    OrderDetail: {} as Orders,
    filterListToArray: [] as FilterWhere<OrderWhere>[],
    searchPage: 1 as number, // 订单列表页面搜索页数
    oldFilterList: {} as Where<ProductOlds>,
    oldFilterListToArray: {} as FilterWhere<ProductOlds>[],
    OldObj: {} as ProductOlds,
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
      const { data } = await https.get<Where<ProductOlds>, null>('/product/old/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldFilterList = data.value.data
        this.oldFilterListToArray = sortArr(this.oldFilterList)
      }
    },
    // 开单增加的旧料列表
    // 从成品列表中拿 成品列表
    async getOldList(pamars: ReqList<ProductFinisheds>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<ProductFinisheds>, ReqList<ProductFinisheds>>('/product/finished/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          if (data.value.data.list.length > 0) {
            const params = data.value.data.list[0]
            // 设置OldObj对象的is_our属性为true，表示该对象属于我们
            this.OldObj.is_our = true
            this.OldObj.code = params.code
            this.OldObj.gem = params.gem
            this.OldObj.weight_metal = Number(params.weight_metal)
            this.OldObj.material = params.material
            this.OldObj.category = params.category
            this.OldObj.color_gem = params.color_gem
            this.OldObj.num_gem = params.num_gem
            this.OldObj.weight_total = Number(params.weight_total)
            this.OldObj.label_price = params.label_price
            this.OldObj.brand = params.brand
            this.OldObj.clarity = params.clarity
            this.OldObj.name = params.name
            this.OldObj.quality = params.quality
            this.OldObj.craft = params.craft
            this.OldObj.weight_gem = Number(params.weight_gem)
          }
          else {
            this.OldObj = {} as ProductOlds
          }
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
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
