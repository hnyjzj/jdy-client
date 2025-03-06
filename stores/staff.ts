export const useStaff = defineStore('staffStore', {
  state: () => ({
    filterList: {} as Where<Staff>,
    staffList: [] as Staff[],
    staffInfo: {} as Staff,
    total: 0,
    filterListToArray: [] as FilterWhere<Staff>[],
    searchPage: 1 as number,
  }),
  getters: {

  },
  actions: {
    // 员工列表
    async getStaffList(req: ReqList<Staff>) {
      if (req.page === 1) {
        this.staffList = []
      }
      const { data } = await https.post<ResList<Staff>, ReqList<Staff>>('/staff/list', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.total = data.value.data.total
        if (data.value.data.list.length > 0) {
          this.staffList = [...this.staffList, ...data.value.data.list]
          if (this.staffList.length === this.total) {
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
    // 获取员工列表，返回选择参数
    async getOptionsStafflist(req: ReqList<Staff>) {
      const { data } = await https.post<ResList<Staff>, ReqList<Staff>>('/staff/list', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return data.value.data.list
      }
      else {
        return []
      }
    },
    /**
     * 创建员工
     */
    async createStaff(req: addStaffReq) {
      try {
        const { data } = await https.post<ResList<Staff>, addStaffReq>('/staff/create', req)

        return data.value
      }
      catch (error) {
        console.error('创建失败：', error)
        throw error
      }
    },
    // 更新员工信息
    // /staff/update
    async updateStaff(req: updateStaffReq) {
      try {
        const { data } = await https.put<ResList<Staff>, updateStaffReq>('/staff/update', req)

        return data.value
      }
      catch (error) {
        console.error('更新失败：', error)
        throw error
      }
    },
    // 获取where 条件
    async getStaffWhere() {
      // /staff/where
      const { data } = await https.get<Where<Staff>, null>('/staff/where')
      if (data.value.code === HttpCode.SUCCESS) {
        this.filterList = data.value.data
        this.filterListToArray = sortArr(this.filterList)
      }
    },
    async getStaffInfo(req: { id: string }) {
      const { data } = await https.post<Staff, { id: string }>('/staff/info', req)
      if (data.value.code === HttpCode.SUCCESS) {
        this.staffInfo = data.value.data
      }
    },
    async uploadAvatar(req: { avatar: File | undefined }) {
      return await https.upload<UploadRes, { avatar: File | undefined }>('/upload/avatar', req)
    },

  },

})
