export const useAllocate = defineStore('Allocate', {
  state: (): {
    /** 调拨列表 */
    allocateList: Allocate[]
    /** 调拨数量 */
    allocateTotal: number
    allocateFilterListToArray: FilterWhere<Allocate>[]
    allocateFilterList: Where<Allocate>
    allocateInfo: Allocate
  } => ({
    allocateList: [],
    allocateTotal: 0,
    allocateFilterListToArray: [] as FilterWhere<Allocate>[],
    allocateFilterList: {} as Where<Allocate>,
    allocateInfo: {} as Allocate,
  }),
  actions: {
    // 调拨列表
    async getAllocateList(pamars: ReqList<Allocate>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<Allocate>, ReqList<Allocate>>('/product/allocate/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.allocateTotal = data.value.data.total
          this.allocateList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取调拨单筛选列表
    async getAllocateWhere() {
      try {
        const { data } = await https.get<Where<Allocate>>('/product/allocate/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.allocateFilterList = data.value.data
          this.allocateFilterListToArray = sortArr(data.value.data)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    /** 调拨单详情 */
    async getAllocateInfo(id: Allocate['id']) {
      try {
        const { data } = await https.post<Allocate, { id: Allocate['id'] }>('/product/allocate/info', { id })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.allocateInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    /** 确认调拨 */
    async confirmAllcate(id: Allocate['id']) {
      try {
        const { data } = await https.put<{ id: string }, any >('/product/allocate/confirm', { id })
        return data.value
      }
      catch (error) {
        throw new Error(`确认失败: ${error || '未知错误'}`)
      }
    },
    /** 取消调拨 */
    async cancelAllcate(id: Allocate['id']) {
      try {
        const { data } = await https.put<{ id: string }, any >('/product/allocate/cancel', { id })
        return data.value
      }
      catch (error) {
        throw new Error(`取消失败: ${error || '未知错误'}`)
      }
    },
    /** 完成调拨 */
    async finishAllcate(id: Allocate['id']) {
      try {
        const { data } = await https.put<{ id: string }, any >('/product/allocate/complete', { id })
        return data.value
      }
      catch (error) {
        throw new Error(`完成调拨失败: ${error || '未知错误'}`)
      }
    },
    /** 删除调拨产品 */
    async remove(id: Allocate['id'], product_id: ProductFinisheds['id']) {
      try {
        const { data } = await https.put<{ id: string, code: string }, any >('/product/allocate/remove', { id, product_id })
        return data.value
      }
      catch (error) {
        throw new Error(`删除失败: ${error || '未知错误'}`)
      }
    },
    /** 添加调拨产品 */
    async add(id: Allocate['id'], product_id: ProductFinisheds['id'][]) {
      try {
        const { data } = await https.put<{ id: string, product_id: ProductFinisheds['id'][] }, any >('/product/allocate/add', { id, product_id })
        return data.value
      }
      catch (error) {
        throw new Error(`添加失败: ${error || '未知错误'}`)
      }
    },
    /** 创建调拨单 */
    async createAllocate(params: AllocateReq) {
      try {
        params = { ...params, store_id: useStores().myStore.id }
        const { data } = await https.post<AllocateReq, any >('/product/allocate/create', params)
        return data.value
      }
      catch (error) {
        throw new Error(`创建失败: ${error || '未知错误'}`)
      }
    },
  },
})
