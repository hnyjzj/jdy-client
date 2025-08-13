import { defineStore } from 'pinia'

export const useBillingSetStore = defineStore('BillingSet', {
  state: (): {

    billingSetFilterList: Where<BillingSet>
    /**
     * 排序后的筛选条件列表
     */
    billingSetFilterListToArray: FilterWhere<BillingSet>[]
    disScore: boolean
    billingSet: BillingSet
  } => ({
    billingSetFilterList: {} as Where<BillingSet>,
    billingSetFilterListToArray: [] as FilterWhere<BillingSet>[],

    billingSet: {} as BillingSet,
    disScore: false, // 是否禁止修改积分抵扣  true:禁止 false:允许
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
      const { data } = await https.post<any, { store_id: string }>('/setting/open_order/info', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.billingSet = data.value.data
        this.disScore = !!(this.billingSet.discount_rate && this.billingSet.discount_rate !== '0')
        return data.value.data
      }
    },
  },
})
