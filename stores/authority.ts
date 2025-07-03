export const useAuthority = defineStore('Authority', {
  state: (): {
    roleList: Roles[]
    roleInfo: Roles
    apiList: Apis[]
    roleWhereList: Record<number, string>
  } => ({
    roleList: [],
    roleInfo: {} as Roles,
    apiList: [],
    roleWhereList: {} as Record<number, string>,
  }),
  actions: {
    // 角色列表
    async getRoleList(identity: number) {
      const { data } = await https.post<any, { identity: number }>('/setting/role/list', { identity })
      if (data.value?.code === HttpCode.SUCCESS) {
        this.roleList = data.value.data
      }
    },
    // 权限列表
    async getApiList() {
      const { data } = await https.post<any>('/setting/role/apis')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.apiList = data.value.data
      }
    },
    // 新增角色
    async addRole(params: RolesParams) {
      const { data } = await https.post<any, RolesParams>('/setting/role/create', params)
      return data.value
    },
    // 删除角色
    async deleteRole(id: string) {
      const { data } = await https.delete<any, { id: string }>('/setting/role/delete', { id })
      return data.value
    },
    // 角色详情
    async getRoleInfo(id: Roles['id']) {
      const { data } = await https.post<any, any>('/setting/role/info', { id })
      if (data.value?.code === HttpCode.SUCCESS) {
        this.roleInfo = data.value.data
      }
    },
    /** 添加成员 */
    async addStaff(id: string, staffs: string[]) {
      const { data } = await https.put<string[], any>('/setting/role/add_staff', { id, staffs })
      return data.value
    },
    /** 更新添加成员 */
    async updateStaff(params: UpdateAuthParams) {
      const { data } = await https.put<string[], any>('/setting/role/update', params)
      return data.value
    },
    /** 更新添加成员 */
    async editRole(params: RolesParams) {
      const { data } = await https.put<RolesParams, any>('/setting/role/edit', params)
      return data.value
    },
    // 获取权限组列表
    async getRoleWhere() {
      try {
        const { data } = await https.get<Record<Roles['id'], string>>('/setting/role/identity')
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
