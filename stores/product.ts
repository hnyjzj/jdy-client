export const useProductManage = defineStore('ProductManage', {
  state: (): {
    productList: Product[]
    filterList: Where<Product>
    productInfo: Product
    productListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    filterListToArray: FilterWhere<Product>[]
  } => ({
    filterList: {} as Where<Product>,
    productList: [],
    productInfo: {} as Product,
    productListTotal: 0,
    filterListToArray: {} as FilterWhere<Product>[],
  }),
  actions: {
    // 货品列表
    async getProductList(pamars: ReqList<Product>) {
      try {
        const { data } = await https.post<ResList<Product>, ReqList<Product>>('/product/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.productListTotal = data.value.data.total
          if (pamars.page === 1) {
            this.productList = data.value.data.list
          }
          else {
            this.productList = this.productList.concat(data.value.data.list)
          }
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 货品导入
    async importProduct(products: Product[]) {
      try {
        const { data } = await https.post<any, { products: Product[] }>('/product/enter/create', { products })
        return data.value
      }
      catch (error) {
        throw new Error(`货品导入失败: ${error || '未知错误'}`)
      }
    },
    // 获取筛选列表
    async getProductWhere() {
      try {
        const { data } = await https.get<Where<Product>>('/product/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.filterList = data.value.data
          this.filterListToArray = sortArr(this.filterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 货品详情
    async getProductInfo(code: Product['code']) {
      try {
        const { data } = await https.post<Product, { code: Product['code'] }>('/product/info', { code })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.productInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    // 更新货品
    async updateProductInfo(pamars: Partial<Product>) {
      try {
        const { data } = await https.put<Product, Partial<Product>>('/product/update', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`更新失败: ${error || '未知错误'}`)
      }
    },
    // 报损
    async damageProduct(pamars: ProductDamage) {
      try {
        const { data } = await https.put<any, ProductDamage>('/product/damage', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`报损失败: ${error || '未知错误'}`)
      }
    },
    // 转换
    async convertProduct(pamars: ProductTransfer) {
      try {
        const { data } = await https.put<any, ProductTransfer>('/product/conversion', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`报损失败: ${error || '未知错误'}`)
      }
    },
  },
})
