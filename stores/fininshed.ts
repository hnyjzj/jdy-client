export const useFinished = defineStore('Finished', {
  state: (): {
    finishedList: ProductFinisheds[]
    finishedFilterList: Where<ProductFinisheds>
    finishedInfo: ProductFinisheds
    finishedListTotal: number
    /**
     * 排序后的筛选条件列表
     */
    finishedFilterListToArray: FilterWhere<ProductFinisheds>[]
  } => ({
    finishedFilterList: {} as Where<ProductFinisheds>,
    finishedList: [],
    finishedInfo: {} as ProductFinisheds,
    finishedListTotal: 0,
    finishedFilterListToArray: [] as FilterWhere<ProductFinisheds>[],
  }),
  actions: {
    // 成品列表
    async getFinishedList(pamars: ReqList<ProductFinisheds>) {
      try {
        pamars = { ...pamars, where: { ...pamars.where, store_id: useStores().myStore.id } }
        const { data } = await https.post<ResList<ProductFinisheds>, ReqList<ProductFinisheds>>('/product/finished/list', pamars)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.finishedListTotal = data.value.data.total
          this.finishedList = data.value.data.list
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品列表失败: ${error || '未知错误'}`)
      }
    },
    /**
     * 获取成品筛选列表
     * @returns finishedFilterList
     */
    async getFinishedWhere() {
      try {
        const { data } = await https.get<Where<ProductFinisheds>>('/product/finished/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.finishedFilterList = data.value.data
          this.finishedFilterListToArray = sortArr(this.finishedFilterList)
        }
        return data.value?.data || {}
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 成品详情
    async getFinishedInfo(code: ProductFinisheds['code']) {
      try {
        const { data } = await https.post<ProductFinisheds, { code: ProductFinisheds['code'] }>('/product/finished/info', { code })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.finishedInfo = data.value.data
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    /**
     * 成品详情
     * 检索专用
     * @param code
     */
    async getFinishedRetrieval(code: ProductFinisheds['code']) {
      try {
        const { data } = await https.post<ProductFinisheds, { code: ProductFinisheds['code'] }>('/product/finished/retrieval', { code })
        if (data.value?.code === HttpCode.SUCCESS) {
          this.finishedInfo = data.value.data
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取货品详情失败: ${error || '未知错误'}`)
      }
    },
    // 更新成品
    async updateFinishedInfo(pamars: Partial<ProductFinisheds>) {
      try {
        const { data } = await https.put<ProductFinisheds, Partial<ProductFinisheds>>('/product/finished/update', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`更新失败: ${error || '未知错误'}`)
      }
    },
    // 成品转换
    async convertFinished(pamars: ProductTransfer) {
      try {
        const { data } = await https.put<any, ProductTransfer>('/product/finished/conversion', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`转换失败: ${error || '未知错误'}`)
      }
    },
    // 获取成品积分比例
    async getFinishedsClass(params: { class: number }) {
      try {
        const { data } = await https.post<any, { class: number }>('/member/integral/rule/finished', params)
        if (data.value?.code === HttpCode.SUCCESS) {
          return data.value?.data
        }
      }
      catch (error) {
        throw new Error(`获取积分比例失败: ${error || '未知错误'}`)
      }
    },
    /** 上传产品图片 */
    async uploadFinishedImg(pamars: UpdateProductFinishedImages) {
      try {
        const { data } = await https.put<any, UpdateProductFinishedImages>('/product/finished/upload', pamars)
        return data.value
      }
      catch (error) {
        throw new Error(`更新失败: ${error || '未知错误'}`)
      }
    },
  },
})
