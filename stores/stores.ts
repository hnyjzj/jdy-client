export const useStores = defineStore('Store', {
  state: () => ({
    filterForm: {} as filterForm,
  }),
  actions: {
    // 门店列表
    async getStoreList(req: GetListReq<storesList>) {
      await https.post<storesListRes, GetListReq<storesList>>('/store/list', req)
    },

  },
})
