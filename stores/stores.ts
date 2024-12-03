export const useStores = defineStore('Store', {
  state: () => ({
    filterForm: {} as filterForm,
  }),
  actions: {
    // 门店列表
    async getStoreList(req: GetListReq<storesList>) {
      const { data } = await https.post<storesListRes, GetListReq<storesList>>('/store/list', req)
      console.log(data.value)
    //   console.log(error)
    },

  },
})
