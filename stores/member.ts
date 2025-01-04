export const useMemberManage = defineStore('MemberManage', {
  state: (): {
    memberList: Member[]
    filterList: MemberWhere
    memberInfo: Member
    memberListTotal: number

  } => ({
    memberList: [],
    filterList: {},
    memberInfo: {} as Member,
    memberListTotal: 0,
  }),

  getters: {
    filterListToArray: (state) => {
      const arr: MemberFilterWhere[] = []
      Object.entries(state.filterList).map((item) => {
        return arr.push({
          ...item[1],
        })
      })
      return arr.sort((a, b) => a.sort - b.sort)
    },
  },

  actions: {
    // 会员列表
    async getMemberList(params: MemberReq) {
      try {
        const { data } = await https.post<MemberRes, MemberReq>('/member/list', params)
        if (data.value.code === HttpCode.SUCCESS) {
          this.memberListTotal = data.value.data.total
          params.page === 1 ? this.memberList = data.value.data.list : this.memberList = this.memberList.concat(data.value.data.list)
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
        const { data } = await https.get<MemberWhere, null>('/member/where', null)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.filterList = data.value.data
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
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
    // 更新
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
