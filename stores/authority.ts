export const useAuthority = defineStore('Authority', {
  state: (): {
    roleList: any[]
    roleInfo: any
    apiList: any[]
    roleWhereList: Where<any>
  } => ({
    roleList: [],
    roleInfo: {} as any,
    apiList: [],
    roleWhereList: {} as Where<any>,
  }),
  actions: {
    // 角色列表
    async getRoleList(identity: number) {
      const { data } = await https.post<any, { identity: number }>('/setting/role/list', { identity })
      if (data.value?.code === HttpCode.SUCCESS) {
        this.roleList = data.value.data
      }
    },
    // 获取权限组列表
    async getRoleWhere() {
      try {
        const { data } = await https.get<Record<any, any>>('/setting/role/identity')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.roleWhereList = data.value.data
        }
      }
      catch (error) {
        throw new Error(`筛选失败: ${error || '未知错误'}`)
      }
    },
  },
})
