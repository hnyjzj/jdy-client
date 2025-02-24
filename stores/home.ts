export const homeDataStore = defineStore('homeDataStore', {
  state: () => ({
    StorePerformanceList: [] as StorePerformance[],
  }),
  getters: {

  },
  actions: {
    async StorePerformance() {
      const { data } = await https.get<StorePerformance[], undefined>('/statistic/total')
      if (data.value.code === HttpCode.SUCCESS) {
        this.StorePerformanceList = data.value.data
      }
    },
  },
})
