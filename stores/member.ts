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
  } => ({
    memberList: [],
    filterList: {},
    memberInfo: {} as Member,
    integralRecord: {} as IntegralRecord[],
    filterIntegralList: {},
    memberListTotal: 0,
    integralRecordTotal: 0,
    filterListToArray: {} as FilterWhere<Member>[],
    filterIntegralListToArray: {} as FilterWhere<IntegralRecord>[],
  }),

  actions: {
    // 会员列表
    async getMemberList(params: ReqList<Member>) {
      try {
        const { data } = await https.post<ResList<Member>, ReqList<Member>>('/member/list', params)
        if (data.value.code === HttpCode.SUCCESS) {
          this.memberListTotal = data.value.data.total
          if (params.page === 1) {
            this.memberList = data.value.data.list
          }
          else {
            this.memberList = this.memberList.concat(data.value.data.list)
          }
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取用户列表失败: ${error || '未知错误'}`)
      }
    },
    // 获取筛选列表
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
    async getMemberInfo(id: string) {
      try {
        const { data } = await https.post<Member, { id: string }>('/member/info', { id })
        if (data.value.code === HttpCode.SUCCESS) {
          this.memberInfo = data.value.data
        }
      }
      catch (error) {
        throw new Error(`获取会员详情失败: ${error || '未知错误'}`)
      }
    },
    // 获取会员积分详情
    async getIntegralRecord(params: ReqList<IntegralRecord>) {
      try {
        const { data } = await https.post<ResList<IntegralRecord>, ReqList<IntegralRecord>>('/member/integral/list', params)
        if (data.value.code === HttpCode.SUCCESS) {
          this.integralRecordTotal = data.value.data.total
          if (params.page === 1) {
            this.integralRecord = data.value.data.list
          }
          else {
            this.integralRecord = this.integralRecord.concat(data.value.data.list)
          }
        }
        return data.value
      }
      catch (error) {
        throw new Error(`获取会员积分详情失败: ${error || '未知错误'}`)
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
