import { defineStore } from 'pinia'

export const useBillingSetStore = defineStore('BillingSet', {
  state: (): {

    billingSetFilterList: Where<BillingSet>
    /**
     * 排序后的筛选条件列表
     */
    billingSetFilterListToArray: FilterWhere<BillingSet>[]

    info: any
  } => ({
    billingSetFilterList: {} as Where<BillingSet>,
    billingSetFilterListToArray: [] as FilterWhere<BillingSet>[],
    info: {},
  }),

  actions: {
    // 开单设置筛选条件
    async getBillingSetWhere() {
      const { data } = await https.get<Where<BillingSet>, null>('/setting/open_order/where')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.billingSetFilterList = data.value.data
        this.billingSetFilterListToArray = sortArr(this.billingSetFilterList)
      }
    },
    async updateSet(params: BillingSet) {
      const { data } = await https.put<undefined, BillingSet>('/setting/open_order/update', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      else {
        return data.value?.message
      }
    },
    async getSetInfo(params: { store_id: string }) {
      // /setting/open_order/info
      const { data } = await https.post<any, { store_id: string }>('/setting/open_order/info', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.info = data.value.data
        return data.value.data
      }
    },
  },
})
