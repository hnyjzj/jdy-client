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
  }),
  getters: {

  },
  actions: {
    // 获取库存类型
    async getStockType() {
      const { data } = await https.get<Where<{ type: number }>>('/statistic/product_inventory_finished/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.filterList = data.value?.data
      }
    },
    // 获取库存title
    async getStockTitle() {
      const { data } = await https.get<StockTitle[]>('/statistic/product_inventory_finished/title')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.title = data.value?.data
      }
    },
    async getStockList(params: { type: number }) {
      const { data } = await https.post<any, { type: number }>('/statistic/product_inventory_finished/data', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.stockList = data.value?.data
      }
    },
    // 获取库存类型
    async OldGetStockType() {
      const { data } = await https.get<Where<{ type: number }>>('/statistic/product_inventory_old/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldfilterList = data.value?.data
      }
    },
    // 获取库存title
    async OldGetStockTitle() {
      const { data } = await https.get<StockTitle[]>('/statistic/product_inventory_old/title')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldtitle = data.value?.data
      }
    },
    async OldGetStockList(params: { type: number }) {
      const { data } = await https.post<any, { type: number }>('/statistic/product_inventory_old/data', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.oldstockList = data.value?.data
      }
    },

    // 收支统计

    async getRevenueWhere() {
      const { data } = await https.get<Where<Revenue>>('/statistic/order_payment/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.RevenueWhere = data.value?.data
      }
    },
    async getRevenueList(params: Revenue) {
      const { data } = await https.post<any, Revenue>('/statistic/order_payment/data', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.RevenueList = data.value?.data
      }
    },
    // 获取库存title
    async getRevenueTitle() {
      const { data } = await https.get<Revenue[]>('/statistic/order_payment/title')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.RevenueTitle = data.value?.data
      }
    },
  },

})
