import { defineStore } from 'pinia'

export const useSaleStore = defineStore('Sale', {
  state: () => ({
    filterList: { },
  }),
  actions: {
    async getSaleWhere() {
      const { data } = await https.get<Where<Staff>, null>('/staff/where')
      if (data.value.code === HttpCode.SUCCESS) {
        this.filterList = data.value.data
      }
    },
  },
})
