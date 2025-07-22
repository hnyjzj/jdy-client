export const useRepair = defineStore('Repair', {
  // 维修单 pinia
  state: () => ({
    repairFilterList: {} as Where<service>,
    repairFilterListToArray: {} as FilterWhere<service>[],

    repairGoods: {} as Where<serviceGoods>,
    repairGoodsFilterListToArray: {} as FilterWhere<serviceGoods>[],
    /**
     * 维修单列表
     */
    repairOrderList: [] as ServiceOrderInfo[],
    total: 0,
    searchPage: 1,
    repairOrderDetail: {} as ServiceOrderInfo,
    showtype: 'list' as 'list' | 'table',
  }),

  actions: {
    /**
     * 获取维修单的where条件
     */
    async getRepairOrderWhere() {
      const { data } = await https.get<Where<service>, null>('/order/repair/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.repairFilterList = data.value.data
        this.repairFilterListToArray = sortArr(this.repairFilterList)
      }
    },
    /**
     * 获取添加维修货品的where 条件
     */
    async getAddRepairOrderWhere() {
      const { data } = await https.get<Where<serviceGoods>, null>('/order/repair/where_product')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.repairGoods = data.value.data
        this.repairGoodsFilterListToArray = sortArr(this.repairGoods)
      }
    },
    /**
     * 创建维修单
     */
    async createRepairOrder(req: serviceOrederCreate) {
      const { data } = await https.post<any, serviceOrederCreate>('/order/repair/create', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
    },
    /**
     * 上传维修单图片
     */
    async uploadRepairOrderImg(file: { image: File | undefined }) {
      return await https.upload<UploadRes, { image: File | undefined }>('/upload/order', file)
    },
    /**
     * 获取维修单列表
     */
    async getRepairOrderList(params: any) {
      const { data } = await https.post<ResList<ServiceOrderInfo>, null>('/order/repair/list', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.repairOrderList = data.value.data.list
        this.total = data.value.data.total
      }
    },
    /**
     * 获取维修单详情
     */
    async getRepairOrderDetail(req: { id: string }) {
      const { data } = await https.post<ServiceOrderInfo, { id: string }>('/order/repair/info', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.repairOrderDetail = data.value.data
      }
    },
    /**
     * 撤销维修单
     */
    async cancelRepairOrder(req: { id: string }) {
      const { data } = await https.put<undefined, { id: string }>('/order/repair/revoked', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      return false
    },
    /**
     * 支付维修单
     */
    async payRepairOrder(req: { id: string }) {
      const { data } = await https.put<undefined, { id: string }>('/order/repair/pay', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      return false
    },

    /**
     * 更新维修单
     */
    async updateRepairOrder(req: updateRepairParams) {
      const { data } = await https.put<undefined, updateRepairParams>('/order/repair/update', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      return false
    },
    /**
     * 维修单退款
     */
    async refundRepairOrder(req: { id: string, remark: string }) {
      const { data } = await https.put<undefined, { id: string, remark: string }>('/order/repair/refund', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      return false
    },

    /**
     * 标记/ 操作
     * @method put
     * @url /order/repair/operation
     */
    async operationRepairOrder(req: { id: string, operation: number }) {
      const { data } = await https.put<undefined, { id: string, operation: number }>('/order/repair/operation', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      return false
    },
  },
})
