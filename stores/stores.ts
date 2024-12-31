export const useStores = defineStore('Store', {
  state: () => ({
    filterList: [] as StoreWhere, // 筛选条件
    storesList: [] as stores[], // 门店列表
    total: 0,
    storeDetails: {} as stores, //  门店详情
    addorUpdateForm: {
      id: undefined,
      address: '',
      name: '',
      logo: '',
      province: '',
      city: '',
      district: '',
      contact: '',
      sort: undefined,
    } as StoreAddorUpdateReq,
  }),
  getters: {
    filterListToArray: (state) => {
      const arr: FilterWhere<Stores>[] = []
      Object.entries(state.filterList).map((item) => {
        return arr.push({
          ...item[1],
        })
      })
      return arr.sort((a, b) => a.sort - b.sort)
    },
  },
  actions: {
    // 门店列表
    async getStoreList(req: storesWhereReq, search: boolean = false) {
      const { data } = await https.post<storesListRes, storesWhereReq>('/store/list', req)
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
    async createStore(req: StoreAddorUpdateReq) {
      const { data } = await https.post<undefined, StoreAddorUpdateReq>('/store/create', req)
      return data.value
    },
    // 更新门店
    async updateStore(req: StoreAddorUpdateReq) {
      const { data } = await https.put<undefined, StoreAddorUpdateReq>('/store/update', req)
      return data.value
    },
    async deleteStore(req: storeDeleteReq) {
      const { data } = await https.delete<undefined, storeDeleteReq>('/store/delete', req)
      return data.value
    },
    // 获取门店详情
    async getStoreDetail(req: storeDetailReq) {
      const { data } = await https.post<stores, storeDetailReq>('/store/info', req)
      if (data.value.code === HttpCode.SUCCESS) {
        this.storeDetails = data.value.data
      }
    },
    async getStoreWhere() {
      const { data } = await https.get<StoreWhere, null>('/store/where', null)
      if (data.value.code === HttpCode.SUCCESS) {
        this.filterList = data.value.data
      }
    },
    async uploadImage(req: uploadLogoFileReq) {
      return await https.upload<uploadFileRes, uploadLogoFileReq>('/upload/store', req)
    },

    // 重置新增表单
    async reastAddForm() {
      this.addorUpdateForm = {
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
  },
})
