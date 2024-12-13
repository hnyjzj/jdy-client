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
    filterListToArray: (state) => {
      const arr: FilterWhere[] = []
      Object.entries(state.filterList).map((item) => {
        return arr.push({
          ...item[1],
        })
      })
      return arr.sort((a, b) => a.sort - b.sort)
    },
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
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 货品导入
    async importProduct(pamars: ProductImport) {
      try {
        const { data } = await https.post<any, ProductImport>('/product/enter', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`货品导入失败: ${error || '未知错误'}`)
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
        throw new Error(`筛选失败: ${error || '未知错误'}`)
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
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    // 更新货品
    async updateProductInfo(pamars: Product) {
      try {
        const { data } = await https.put<Product, Product>('/product/update', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`更新失败: ${error || '未知错误'}`)
      }
    },
    // 报损
    async damageProduct(pamars: ProductLossReq) {
      try {
        const { data } = await https.put<any, ProductLossReq>('/product/damage', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`报损失败: ${error || '未知错误'}`)
      }
    },

  },
})
