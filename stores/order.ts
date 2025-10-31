export const useOrder = defineStore('Order', {
  state: () => ({
    OrdersList: [] as OrderInfo[],
    filterList: {} as Where<OrderWhere>,
    todayPrice: '' as string,
    total: 0 as number,
    OrderDetail: {} as OrderInfo,
    filterListToArray: [] as FilterWhere<OrderWhere>[],
    oldFilterList: {} as Where<OrderMaterial>,
    oldFilterListToArray: [] as FilterWhere<OrderMaterial>[],
    showtype: 'list' as 'list' | 'table',
    OldObj: {} as OrderMaterial,
    orderObject: {} as Orders,
  }),
  actions: {
    /**
     * 获取销售单筛选条件
     * @return filterList
     */
    async getSaleWhere() {
      const { data } = await https.get<Where<OrderWhere>, null>('/order/sales/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.filterList = data.value.data
        this.filterListToArray = sortArr(this.filterList)
      }
    },
    /**
     * 获取旧料的新增条件
     */
    async OldMaterialsWhere() {
      const { data } = await https.get<Where<OrderMaterial>, null>('/product/old/where_create')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldFilterList = data.value.data
        this.oldFilterListToArray = sortArr(this.oldFilterList)
      }
    },
    // 开单增加的旧料列表
    // 从成品列表中拿 成品列表
    async getOldList(pamars: ReqList<OrderMaterial>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where } }
        const { data } = await https.post<ResList<OrderMaterial>, ReqList<OrderMaterial>>('/product/finished/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          if (data.value.data.list !== null && data.value.data.list?.length > 0) {
            const params = data.value.data.list[0]
            this.OldObj = params
            this.OldObj.product_id = params.id
            this.OldObj.weight_metal = Number(params.weight_metal)
            this.OldObj.code_finished = params.code
            return this.OldObj
          }
          else {
            this.OldObj = {} as OrderMaterial
            return this.OldObj
          }
        }
        else {
          return {} as OrderMaterial
        }
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取订单列表
    async getOrderList(req: ReqList<OrderInfo>) {
      this.OrdersList = []
      const { data } = await https.post<ResList<OrderInfo>, ReqList<OrderInfo>>('/order/sales/list', req)
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
          this.OrdersList = []
          // 当前页没有数据，则不进行下一页
          return false
        }
      }
    },

    /*
    获取所有订单列表
    */
    async getOrderListAll(pamars: AllFinished<OrderInfo>) {
      pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
      const { data } = await https.post<ResList<OrderInfo>, AllFinished<OrderInfo>>('/order/sales/list', pamars)
      if (data.value?.code === HttpCode.SUCCESS) {
        return data.value.data.list
      }
      return []
    },

    // 获取今日金价
    async getTodayPrice() {
      const { data } = await https.get<any, null>('/setting/gold_price/get')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.todayPrice = data.value.data.price
      }
    },
    // 新增销售单
    async submitOrder(req: Orders) {
      const { data } = await https.post<OrderInfo, Orders>('/order/sales/create', req)
      return data.value
    },
    /**
     * 获取订单详情
     * @param req
     * @param req.id { id: string }
     * @returns OrderDetail
     */
    async getOrderDetail(req: { id: string }) {
      const { data } = await https.post<OrderInfo, { id: string }>('/order/sales/info', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.OrderDetail = data.value.data
        return true
      }
    },
    /**
     *撤销订单
     * @param {object} req - 撤销订单请求参数
     * @param {string} req.id - 订单id
     * @returns {Promise<boolean>}
     *  - true: 支付成功
     *  - false: 支付失败或接口异常
     */
    async revokedOrder(req: { id: string }) {
      const { data } = await https.put<any, { id: string }>('/order/sales/revoked', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      return false
    },
    /**
     *确认支付订单
     * @param {object} req - 支付请求参数
     * @param {string} req.id - 订单id
     * @returns {Promise<boolean>}
     *  - true: 支付成功
     *  - false: 支付失败或接口异常
     */
    async payOrder(req: { id: string }) {
      const { data } = await https.put<any, { id: string }>('/order/sales/pay', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      return false
    },
    /**
     *订单成品退货接口
     * @param {object} req - 退货请求参数
     * @param {string} req.id - 订单id
     * @param {number} req.method - 退货入库方式，成品类型必传
     * @param {Payment[]} req.payments - 退款支付方式
     * @param {string} req.price - 退款金额
     * @param {string} req.product_id - 成品id
     * @param {string} req.remark - 备注
     * @param {number} req.product_type - 成品类型
     * @returns {Promise<boolean>}
     *  - true: 支付成功
     *  - false: 支付失败或接口异常
     */
    async returnOrderGoods(req: ReturnGoods) {
      const { data } = await https.put<any, ReturnGoods>('/order/sales/refund', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return { code: data.value?.code, message: '退货成功' }
      }
      else {
        return { code: data.value?.code, message: data.value?.message || '退货失败' }
      }
    },
    /**
     * 退单接口 put   /order/sales/retreat
     */
    async retreatOrder(req: { id: string }) {
      const { data } = await https.put<any, { id: string }>('/order/sales/retreat', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return { code: data.value?.code, message: '退单成功' }
      }
      else {
        return { code: data.value?.code, message: data.value?.message || '退单失败' }
      }
    },

    async initObjForm() {
      this.orderObject = {} as Orders
    },
    // 初始化导购员 和 收款方式 和 积分
    async initOptions() {
      this.orderObject.payments ??= [{ payment_method: 1, amount: undefined }]
      this.orderObject.clerks ??= [{ salesman_id: undefined, performance_rate: 100, is_main: true }]
      this.orderObject.has_integral ??= false
    },
  },
  persist: [
    {
      pick: ['orderObject'],
      storage: piniaPluginPersistedstate.localStorage(),
    },
  ],
})
