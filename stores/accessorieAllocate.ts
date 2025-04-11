export const useAccessorieAllocate = defineStore('AccessorieAllocate', {
  state: (): {
    /** 调拨列表 */
    accessorieAllocateList: AccessorieAllocate[]
    /** 调拨数量 */
    accessorieAllocateTotal: number
    accessorieAllocateFilterListToArray: FilterWhere<AccessorieAllocate>[]
    accessorieAllocateFilterList: Where<AccessorieAllocate>
    accessorieAllocateInfo: AccessorieAllocate
  } => ({
    accessorieAllocateList: [],
    accessorieAllocateTotal: 0,
    accessorieAllocateFilterListToArray: [] as FilterWhere<AccessorieAllocate>[],
    accessorieAllocateFilterList: {} as Where<AccessorieAllocate>,
    accessorieAllocateInfo: {} as AccessorieAllocate,
  }),
  actions: {
    // 调拨列表
    async getAccessorieAllocate(pamars: ReqList<AccessorieAllocate>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<AccessorieAllocate>, ReqList<AccessorieAllocate>>('/product/accessorie/allocate/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.accessorieAllocateTotal = data.value.data.total
          this.accessorieAllocateList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取筛选列表
    async getAccessorieAllocateWhere() {
      try {
        const { data } = await https.get<Where<AccessorieAllocate>>('/product/accessorie/allocate/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.accessorieAllocateFilterList = data.value.data
          this.accessorieAllocateFilterListToArray = sortArr(data.value.data)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    /** 调拨详情 */
    async getAccessorieAllocateInfo(id: AccessorieAllocate['id']) {
      try {
        const { data } = await https.post<AccessorieAllocate, { id: AccessorieAllocate['id'] }>('/product/accessorie/allocate/info', { id })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.accessorieAllocateInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },

    /** 确认调拨 */
    async confirmAllcate(id: AccessorieAllocate['id']) {
      try {
        const { data } = await https.put<{ id: string }, any >('/product/accessorie/allocate/confirm', { id })
        return data.value
      }
      catch (error) {
        throw new Error(`确认失败: ${error || '未知错误'}`)
      }
    },
    /** 取消调拨 */
    async cancelAllcate(id: AccessorieAllocate['id']) {
      try {
        const { data } = await https.put<{ id: string }, any >('/product/accessorie/allocate/cancel', { id })
        return data.value
      }
      catch (error) {
        throw new Error(`取消失败: ${error || '未知错误'}`)
      }
    },
    /** 完成调拨 */
    async finishAllcate(id: AccessorieAllocate['id']) {
      try {
        const { data } = await https.put<{ id: string }, any >('/product/accessorie/allocate/complete', { id })
        return data.value
      }
      catch (error) {
        throw new Error(`完成调拨失败: ${error || '未知错误'}`)
      }
    },
    /** 删除调拨产品 */
    async remove(id: AccessorieAllocate['id'], product_id: ProductFinisheds['code']) {
      try {
        const { data } = await https.put<{ id: string, product_id: string }, any >('/product/accessorie/allocate/remove', { id, product_id })
        return data.value
      }
      catch (error) {
        throw new Error(`删除失败: ${error || '未知错误'}`)
      }
    },
    /** 添加调拨产品 */
    async addAccessorieAllocate(params: AddAccessorieAllocateReq) {
      try {
        const { data } = await https.put<AddAccessorieAllocateReq, any >('/product/accessorie/allocate/add', params)
        return data.value
      }
      catch (error) {
        throw new Error(`添加失败: ${error || '未知错误'}`)
      }
    },
    /** 创建调拨单 */
    async createAccessorieAllocate(params: AccessorieAllocateReq) {
      try {
        params = { ...params, store_id: useStores().myStore.id }
        const { data } = await https.post<AccessorieAllocateReq, any >('/product/accessorie/allocate/create', params)
        return data.value
      }
      catch (error) {
        throw new Error(`创建失败: ${error || '未知错误'}`)
      }
    },
  },
})
