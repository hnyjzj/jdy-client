export const useMemberManage = defineStore('Member', {
  state: (): {
    memberList: Member[]
    filterList: Where<Member>
    memberInfo: Member
    integralRecord: IntegralRecord[]
    filterIntegralList: Where<IntegralRecord>
    memberListTotal: number
    integralRecordTotal: number
    filterListToArray: FilterWhere<Member>[]
    filterIntegralListToArray: FilterWhere<IntegralRecord>[]
    searchPage: number
    searchIntegralPage: number
  } => ({
    memberList: [],
    filterList: {},
    memberInfo: {} as Member,
    integralRecord: {} as IntegralRecord[],
    filterIntegralList: {},
    memberListTotal: 0,
    integralRecordTotal: 0,
    filterListToArray: [] as FilterWhere<Member>[],
    filterIntegralListToArray: [] as FilterWhere<IntegralRecord>[],
    searchPage: 1,
    searchIntegralPage: 1,
  }),

  actions: {
    // 获取会员列表
    async getMemberList(params: ReqList<Member>) {
      if (params.page === 1) {
        this.memberList = []
      }
      const { data } = await https.post<ResList<Member>, ReqList<Member>>('/member/list', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.memberListTotal = data.value.data.total
        if (data.value.data.list.length > 0) {
          this.memberList = data.value.data.list
          if (this.memberList.length === this.memberListTotal) {
            return false
          }
          return true
        }
        else {
          return false
        }
      }
    },
    /**
     * 获取会员筛选条件
     * @returns filterList
     */
    async getMemberWhere() {
      try {
        const { data } = await https.get<Where<Member>>('/member/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.filterList = data.value.data
          this.filterListToArray = sortArr(this.filterList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 新增会员
    async createMember(req: Partial<Member>) {
      try {
        const { data } = await https.post<undefined, Partial<Member>>('/member/create', req)
        return data.value
      }
      catch (error) {
        throw new Error(`新增会员失败: ${error || '未知错误'}`)
      }
    },
    // 会员详情
    async getMemberInfo<T extends { id?: string, external_user_id?: string }>(params: T) {
      try {
        const { data } = await https.post<Member, T>('/member/info', params)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.memberInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取会员详情失败: ${error || '未知错误'}`)
      }
    },

    // 获取会员积分详情
    async getIntegralRecord(params: ReqList<IntegralRecord>) {
      if (params.page === 1) {
        this.integralRecord = []
      }
      const { data } = await https.post<ResList<IntegralRecord>, ReqList<IntegralRecord>>('/member/integral/list', params)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.integralRecordTotal = data.value.data.total
        if (data.value.data.list.length > 0) {
          this.integralRecord = data.value.data.list
          if (this.integralRecord.length === this.integralRecordTotal) {
            return false
          }
          return true
        }
        else {
          return false
        }
      }
    },
    // 获取积分筛选列表
    async getIntegralWhere() {
      try {
        const { data } = await https.get<Where<IntegralRecord>>('/member/integral/where')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.filterIntegralList = data.value.data
          this.filterIntegralListToArray = sortArr(this.filterIntegralList)
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
    // 更新会员积分
    async updateIntegral(params: IntegralReq) {
      try {
        const { data } = await https.post<IntegralRecord, IntegralReq>('/member/integral/change', params)
        return data.value
      }
      catch (error) {
        throw new Error(`更新失败: ${error || '未知错误'}`)
      }
    },
    // 更新会员信息
    async updateMemberInfo(params: Member) {
      try {
        const { data } = await https.put<Member, Member>('/member/update', params)
        return data.value
      }
      catch (error) {
        throw new Error(`更新失败: ${error || '未知错误'}`)
      }
    },

  },
})
