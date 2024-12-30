export const useStores = defineStore('Store', {
  state: () => ({
    filterForm: {} as StoresWhere,
    storesList: [] as stores[],
    total: 0,
    storeDetails: {} as stores,
    showName: {
      province_name: '' as string,
    },
    formList: {
      address: undefined,
      name: undefined,
      province: undefined,
      city: undefined,
      district: undefined,
      contact: undefined,
    } as StoresWhere,

    addForm: {
      address: '',
      name: '',
      logo: '',
      province: '',
      city: '',
      district: '',
      contact: '',
      sort: undefined,
    } as addStoreReq,
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
      const { data } = await https.post<undefined, addStoreReq>('/store/create', req)
      return data.value
    },
    // 更新门店
    async updateStore(req: updateStoreReq) {
      const { data } = await https.put<undefined, updateStoreReq>('/store/update', req)
      return data.value
    },
    async deleteStore(req: storeDeleteReq) {
      const { data } = await https.delete<undefined, storeDeleteReq>('/store/delete', req)
      return data.value
    },
    // 获取门店详情
    async getStoreDetail(req: storeDetailReq) {
      try {
        const { data } = await https.post<stores, storeDetailReq>('/store/info', req)
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

    // 重置新增表单
    async reastAddForm() {
      this.addForm = {
        address: '',
        name: '',
        logo: '',
        province: '',
        city: '',
        district: '',
        contact: '',
        sort: 0,
      }
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
    // pick: ['addForm', 'searchKey', 'addsearchKey', 'showName', 'realSearchKey', 'addrealSearchKey'],
  },
})
