export const useProductManage = defineStore('ProductManage', {
  state: (): {
    productList: Product[]
    filterList: ProductWhere
    productInfo: Product
  } => ({
    filterList: {} as ProductWhere,
    productList: [],
    productInfo: {} as Product,
  }),
  getters: {

  },
  actions: {
    // 货品列表
    async getProductList(pamars: ProductReq) {
      try {
        const { data } = await https.post<ProductRes, ProductReq>('/product/list', pamars)
        if (data.value.code === HttpCode.SUCCESS) {
          this.productList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取工作台列表失败: ${error || '未知错误'}`)
      }
    },
    // 货品导入
    async importProduct(pamars: ProductImport) {
      try {
        const { data } = await https.post<any, ProductImport>('/product/enter', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`获取工作台列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取筛选列表
    async getProductWhere() {
      try {
        const { data } = await https.get<ProductWhere, null>('/product/where', null)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.filterList = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取工作台列表失败: ${error || '未知错误'}`)
      }
    },
    // 货品详情
    async getProductInfo(code: string) {
      try {
        const { data } = await https.post<Product, { code: string }>('/product/info', { code })
        if (data.value.code === HttpCode.SUCCESS) {
          this.productInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取工作台列表失败: ${error || '未知错误'}`)
      }
    },
  },
})
