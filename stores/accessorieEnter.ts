export const useAccessorieEnter = defineStore('accessorieEnter', {
  state: (): {
    EnterList: AccessorieEnter[]
    enterFilterList: Where<AccessorieEnter>
    EnterListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    EnterToArray: FilterWhere<AccessorieEnter>[]
    enterInfo: AccessorieEnter
    addProductEnterToArray: FilterWhere<ProductAccessories>[]
    addProductEnterFilterList: Where<ProductAccessories>
  } => ({
    enterFilterList: {} as Where<AccessorieEnter>,
    EnterList: [],
    EnterListTotal: 0,
    EnterToArray: [] as FilterWhere<AccessorieEnter>[],
    enterInfo: {} as AccessorieEnter,
    addProductEnterToArray: [] as FilterWhere<ProductAccessories>[],
    addProductEnterFilterList: {} as Where<ProductAccessories>,
  }),
  actions: {
    // 获取配件入库单列表
    async getAccessorieEnterList(pamars: ReqList<AccessorieEnter>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<AccessorieEnter>, ReqList<AccessorieEnter>>('/product/accessorie/enter/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.EnterListTotal = data.value.data.total
          this.EnterList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取配件入库单筛选列表
    async getAccessorieEnterWhere() {
      try {
        const { data } = await https.get<Where<AccessorieEnter>>('/product/accessorie/enter/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.enterFilterList = data.value.data
          this.EnterToArray = sortArr(this.enterFilterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 获取配件入库单筛选列表
    async getAccessorieEnterAddProductWhere() {
      try {
        const { data } = await https.get<Where<ProductAccessories>>('/product/accessorie/enter/where_add_product')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.addProductEnterFilterList = data.value.data
          this.addProductEnterToArray = sortArr(this.addProductEnterFilterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    /** 添加配件入库单 */
    async createAccessorieEnter(params: CreateProductFinishedEnter) {
      try {
        const { data } = await https.post<any, CreateProductFinishedEnter>('/product/accessorie/enter/create', params)
        return data.value
      }
      catch (error) {
        throw new Error(`添加配件入库单失败: ${error || '未知错误'}`)
      }
    },
    /** 添加配件入库单产品 */
    async addAccessorieEnter(params: AccessorieEnterReq) {
      try {
        const { data } = await https.post<any, AccessorieEnterReq>('/product/accessorie/enter/add_product', params)
        return data.value
      }
      catch (error) {
        throw new Error(`货品导入失败: ${error || '未知错误'}`)
      }
    },
    /** 编辑配件入库单产品 */
    async editAccessorieEnter(params: editAccessorieEnterReq) {
      try {
        const { data } = await https.put<any, editAccessorieEnterReq>('/product/accessorie/enter/edit_product', params)
        return data.value
      }
      catch (error) {
        throw new Error(`编辑失败: ${error || '未知错误'}`)
      }
    },
    // 获取配件入库单详情
    async getAccessorieEnterInfo(params: AccessorieEnterInfoReq) {
      try {
        const { data } = await https.post<AccessorieEnter, AccessorieEnterInfoReq>('/product/accessorie/enter/info', params)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.enterInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取配件入库单详情失败: ${error || '未知错误'}`)
      }
    },
    // 删除配件入库单产品
    async delAccessorieEnter(params: DelAccessorieEnter) {
      try {
        const { data } = await https.delete<any, DelAccessorieEnter>('/product/accessorie/enter/del_product', params)
        return data.value
      }
      catch (error) {
        throw new Error(`删除配件入库单产品失败: ${error || '未知错误'}`)
      }
    },

    // 清空配件入库单产品
    async clearAccessorieEnter(id: string) {
      try {
        const { data } = await https.delete<any, { enter_id: string }>('/product/accessorie/enter/clear_product', { enter_id: id })
        return data.value
      }
      catch (error) {
        throw new Error(`删除配件入库单产品失败: ${error || '未知错误'}`)
      }
    },
    // 取消入库
    async cancelAccessorieEnter(enter_id: AccessorieEnter['id']) {
      try {
        const { data } = await https.put<any, { enter_id: AccessorieEnter['id'] }>('/product/accessorie/enter/cancel', { enter_id })
        return data.value
      }
      catch (error) {
        throw new Error(`取消入库失败: ${error || '未知错误'}`)
      }
    },
    // 完成入库
    async successAccessorieEnter(enter_id: AccessorieEnter['id']) {
      try {
        const { data } = await https.put<any, { enter_id: AccessorieEnter['id'] }>('/product/accessorie/enter/finish', { enter_id })
        return data.value
      }
      catch (error) {
        throw new Error(`完成入库失败: ${error || '未知错误'}`)
      }
    },
  },
})
