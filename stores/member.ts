export const useMemberManage = defineStore('Member', {
  state: (): {
    memberList: Member[]
    filterList: Where<Member>
    memberInfo: Member
    memberIntegral: MemberIntegral[]
    memberListTotal: number
    filterListToArray: FilterWhere<Member>[]
  } => ({
    memberList: [],
    filterList: {},
    memberInfo: {} as Member,
    memberIntegral: {} as MemberIntegral[],
    memberListTotal: 0,
    filterListToArray: {} as FilterWhere<Member>[],
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
    async getMemberIntegral(params: ReqList<MemberIntegral>) {
      try {
        const { data } = await https.post<ResList<MemberIntegral>, ReqList<MemberIntegral>>('/member/integral/list', params)
        if (data.value.code === HttpCode.SUCCESS) {
          this.memberListTotal = data.value.data.total
          if (params.page === 1) {
            this.memberIntegral = data.value.data.list
          }
          else {
            this.memberIntegral = this.memberIntegral.concat(data.value.data.list)
          }
        }
      }
      catch (error) {
        throw new Error(`获取会员积分详情失败: ${error || '未知错误'}`)
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
