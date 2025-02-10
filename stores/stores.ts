export const useStores = defineStore('Store', {
  state: () => ({
    filterList: {} as Where<Stores>, // 筛选条件
    storesList: [] as Stores[], // 门店列表
    total: 0,
    storeDetails: {} as Stores, //  门店详情
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
    } as Partial<Stores>,
    // 我的门店
    myStoreList: [] as Stores[],
    // 当前门店
    myStore: {} as Stores,
    StoreStaffList: [] as StoresStaff[],
  }),
  getters: {
    filterListToArray: (state) => {
      const arr: FilterWhere<Stores>[] = []
      for (const [_k, item] of Object.entries(state.filterList)) {
        arr.push({
          ...item,
        })
      }
      return arr.sort((a, b) => a.sort - b.sort)
    },
  },
  actions: {
    // 门店列表
    async getStoreList(req: ReqList<Stores>, search?: boolean) {
      if (req.page === 1) {
        this.storesList = []
      }
      const { data } = await https.post<ResList<Stores>, ReqList<Stores>>('/store/list', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.total = data.value.data.total
        if (data.value.data.list.length > 0) {
          this.storesList = [...this.storesList, ...data.value.data.list]

          if (search) {
            return this.storesList
          }

          if (this.storesList.length === this.total) {
            return false
          }
          return true
        }
        else {
          // 当前页没有数据，则不进行下一页
          return false
        }
      }
    },
    // 门店列表
    async staffGetStoreList(req: ReqList<Stores>) {
      const { data } = await https.post<ResList<Stores>, ReqList<Stores>>('/store/list', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return data.value.data.list
      }
      else {
        return []
      }
    },
    // 创建门店
    async createStore(req: Partial<Stores>) {
      const { data } = await https.post<undefined, Partial<Stores>>('/store/create', req)
      return data.value
    },
    // 更新门店
    async updateStore(req: Partial<Stores>) {
      const { data } = await https.put<undefined, Partial<Stores>>('/store/update', req)
      return data.value
    },
    async deleteStore(id: Stores['id']) {
      const { data } = await https.delete<undefined, { id: Stores['id'] }>('/store/delete', { id })
      return data.value
    },
    // 获取门店详情
    async getStoreDetail(id: Stores['id']) {
      const { data } = await https.post<Stores, { id: Stores['id'] }>('/store/info', { id })
      if (data.value.code === HttpCode.SUCCESS) {
        this.storeDetails = data.value.data
      }
    },
    async getStoreWhere() {
      const { data } = await https.get<Where<Stores>, null>('/store/where', null)
      if (data.value.code === HttpCode.SUCCESS) {
        this.filterList = data.value.data
      }
    },
    async uploadImage(req: uploadLogoFileReq) {
      return await https.upload<UploadRes, uploadLogoFileReq>('/upload/store', req)
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
    // 我的门店
    async getMyStore(req: ReqList<Stores>) {
      try {
        const { data } = await https.post<Stores[], ReqList<Stores>>('/store/my', req)
        if (data.value.code === HttpCode.SUCCESS) {
          this.myStoreList = data.value.data
          if (Object.keys(this.myStore).length === 0) {
            this.myStore = this.myStoreList[0] || {}
          }
        }
      }
      catch (error) {
        console.error(error)
      }
    },
    // 切换门店
    async switchStore(params: Stores) {
      this.myStore = params
    },
    // 门店员工列表
    async getStoreStaffList(req: { id: StoresStaff['id'] }) {
      const { data } = await https.post<StoresStaff[], { id: StoresStaff['id'] }>('/store/staff/list', req)
      if (data.value.code === HttpCode.SUCCESS) {
        this.StoreStaffList = data.value.data
      }
    },

  },
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
    pick: ['myStore'],
  },
})
