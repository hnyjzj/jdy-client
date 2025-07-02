export const useRegion = defineStore('Region', {
  state: () => ({
    filterList: {} as Where<Region>, // 筛选条件
    regionList: [] as Region[], // 门店列表
    total: 0,
    searchPage: 1, // 页码
    regionDetails: {} as Region, //  门店详情
    addorUpdateForm: {
      id: undefined,
      name: '',
    } as Partial<Region>,
    // 我的门店
    myRegionList: [] as Region[],
    // 当前门店
    myRegion: {} as Region,
    RegionStaffList: [] as RegionStaff[],
    filterListToArray: [] as FilterWhere<Region>[],
  }),

  actions: {
    // 门店列表
    async getRegionList(req: ReqList<Region>, search?: boolean) {
      if (req.page === 1) {
        this.regionList = []
      }
      const { data } = await https.post<ResList<Region>, ReqList<Region>>('/region/list', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.total = data.value.data.total
        if (data.value.data.list.length > 0) {
          this.regionList = [...this.regionList, ...data.value.data.list]

          if (search) {
            return this.regionList
          }

          if (this.regionList.length === this.total) {
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
    // 区域列表
    async staffGetRegionList(req: ReqList<Region>) {
      const { data } = await https.post<ResList<Region>, ReqList<Region>>('/region/list', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return data.value.data.list
      }
      else {
        return []
      }
    },
    // 创建区域
    async createRegion(req: Partial<Region>) {
      const { data } = await https.post<undefined, Partial<Region>>('/region/create', req)
      return data.value
    },
    // 更新区域
    async updateRegion(req: Partial<Region>) {
      const { data } = await https.put<undefined, Partial<Region>>('/region/update', req)
      return data.value
    },
    async deleteRegion(id: Region['id']) {
      const { data } = await https.delete<undefined, { id: Region['id'] }>('/region/delete', { id })
      return data.value
    },
    // 获取门店详情
    async getRegionDetail(id: Region['id'], update: boolean = false) {
      const { data } = await https.post<Region, { id: Region['id'] }>('/region/info', { id })
      if (data.value?.code === HttpCode.SUCCESS) {
        if (update) {
          this.myRegion = data.value.data
        }
        this.regionDetails = data.value.data
      }
    },
    async getRegionWhere() {
      const { data } = await https.get<Where<Region>, null>('/region/where', null)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.filterList = data.value.data
        this.filterListToArray = sortArr(this.filterList)
      }
    },
    async uploadImage(req: uploadLogoFileReq) {
      return await https.upload<UploadRes, uploadLogoFileReq>('/upload/region', req)
    },

    // 重置新增表单
    async reastAddForm() {
      this.addorUpdateForm = {
        address: '',
        name: '',
        province: '',
        city: '',
        district: '',
        sort: 0,
      }
    },
    // 我的门店
    async getMyRegion(req: ReqList<Stores>) {
      try {
        const { data } = await https.post<Region[], ReqList<Region>>('/region/my', req)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.myRegionList = data.value.data
          //   如果选择当前门店，则默认选中第一个
          if (!this.myRegion.id) {
            this.myRegion = this.myRegionList[0] || {}
          }
          //   如果列表中没有当前的门店，则默认选中第一个 (应对分配门店被移除时的情况)
          const isStore = this.myRegionList.find(store => store.id === this.myRegion.id)
          if (!isStore) {
            this.myRegion = this.myRegionList[0] || {}
          }
        }
      }
      catch (error) {
        console.error(error)
      }
    },
    // 切换区域
    async switchStore(params: Region) {
      this.myRegion = params
    },
    // 区域员工列表
    async getStoreStaffList(req: { id: RegionStaff['id'] }) {
      const { data } = await https.post<RegionStaff[], { id: RegionStaff['id'] }>('/region/staff/list', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.RegionStaffList = data.value.data
      }
    },
    // 为区域分配员工
    async assignStaff(req: AssignStaff) {
      const { data } = await https.post<any, AssignStaff>('/region/staff/add', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      else {
        return false
      }
    },
    /**
     * 分配负责人
     */
    async assignSuperiors(req: RegionAssignsuperior) {
      const { data } = await https.post<any, RegionAssignsuperior>('/region/superior/add', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      else {
        return false
      }
    },
    /**
     * 分配门店
     */
    async assignStores(req: RegionassignStores) {
      const { data } = await https.post<any, RegionassignStores>('/region/store/add', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      else {
        return false
      }
    },
    // 移除员工
    async deleteStaff(req: AssignStaff) {
      const { data } = await https.delete<any, AssignStaff>('/region/staff/del', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      else {
        return false
      }
    },
    /**
     * 移除负责人
     */
    async Delsuperiors(req: RegionAssignsuperior) {
      const { data } = await https.delete<any, RegionAssignsuperior>('/region/superior/del', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      else {
        return false
      }
    },
    /**
     * 移除区域门店
     */
    async DelRegionStore(req: RegionassignStores) {
      const { data } = await https.delete<any, RegionassignStores>('/region/store/del', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return true
      }
      else {
        return false
      }
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
    pick: ['myStore'],
  },
})
