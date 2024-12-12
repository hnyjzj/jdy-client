export const useStores = defineStore('Store', {
  state: () => ({
    filterForm: {} as filterForm,
    storesList: [] as storesList[],
    total: 0,
    storeDetails: {} as getStoreDetailRes,
  }),
  actions: {
    // 门店列表
    async getStoreList(req: storeListReq, search: boolean = false) {
      const { data } = await https.post<storesListRes, storeListReq>('/store/list', req)
      if (data.value.code === HttpCode.SUCCESS) {
        if (!search) {
          this.storesList = data.value.data.list
          this.total = data.value.data.total
        }
        else {
          return data.value.data.list
        }
      }
    },
    // 创建门店
    async createStore(req: addStoreReq) {
      const { data } = await https.post<addStoreRes, addStoreReq>('/store/create', req)
      return data.value
    },
    // 更新门店
    async updateStore(req: updateStoreReq) {
      const { data } = await https.put<updateStoreRes, updateStoreReq>('/store/update', req)
      return data.value
    },
    async deleteStore(req: deleteStoreReq) {
      const { data } = await https.delete<deleteStoreRes, deleteStoreReq>('/store/delete', req)
      return data.value
    },
    // 获取门店详情
    async getStoreDetail(req: getStoreDetailReq) {
      try {
        const { data } = await https.post<getStoreDetailRes, getStoreDetailReq>('/store/info', req)
        if (data.value.code === HttpCode.SUCCESS) {
          this.storeDetails = data.value.data
        }
      }
      catch (error) {
        console.error(error)
      }
    },
    async uploadImage(req: uploadLogoFileReq) {
      return await https.upload<uploadFileRes, uploadLogoFileReq>('/upload/store', req)
    },
  },
})
