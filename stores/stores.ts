export const useStores = defineStore('Store', {
  state: () => ({
    filterForm: {} as filterForm,
    storesList: [] as storesList[],
    total: 0,
    storeDetails: {} as getStoreDetailRes,
    showName: {
      province_name: '' as string,
    },
    formList: {
      parent_id: undefined,
      address: undefined,
      name: undefined,
      province: undefined,
      city: undefined,
      district: undefined,
      contact: undefined,
      wxwork_id: undefined,
    } as Where,
    searchKey: '' as string,
    realSearchKey: '' as string,
    addsearchKey: '' as string,
    addrealSearchKey: '' as string,
    addForm: {
      parent_id: undefined,
      address: '',
      name: '',
      logo: '',
      province: '',
      city: '',
      district: '',
      contact: '',
      wxwork_id: undefined,
      sort: undefined,
      sync_wxwork: true,
    } as addStoreReq,
    // 我的门店
    myStoreList: [] as storesList[],
    // 当前门店
    newStore: {} as CurrentStoreType,
  }),
  actions: {
    // 门店列表
    async getStoreList(req: storeListReq, search: boolean = false) {
      const { data } = await https.post<storesListRes, storeListReq>('/store/list', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        if (!search) {
          this.total = data.value.data.total
          if (data.value.data.list.length > 0) {
            this.storesList = [...this.storesList, ...data.value.data.list]
            if (this.storesList.length === this.total) {
              return false
            }
          }
          else {
            // 当前页没有数据，则不进行下一页
            return false
          }
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
    // 我的门店
    async getMyStore(req: storeListReq) {
      try {
        const { data } = await https.post<storesList[], storeListReq>('/store/my', req)
        if (data.value.code === HttpCode.SUCCESS) {
          this.myStoreList = data.value.data
          if (Object.keys(this.newStore).length === 0) {
            this.newStore = { name: this.myStoreList[0].name, id: this.myStoreList[0].id }
          }
        }
      }
      catch (error) {
        console.error(error)
      }
    },
    // 切换门店
    async switchStore(params: CurrentStoreType) {
      this.newStore = params
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
    // pick: ['addForm', 'searchKey', 'addsearchKey', 'showName', 'realSearchKey', 'addrealSearchKey'],
    pick: ['newStore'],
  },
})
