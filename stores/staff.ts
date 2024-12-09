export const useStaff = defineStore('staffStore', {
  state: () => ({
  }),
  getters: {

  },
  actions: {
    /**
     * 创建员工
     */
    async createStaff(req: addStaffReq) {
      try {
        const { data } = await https.post<addStaffRes, addStaffReq>('/staff/create', req)

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
        const { data } = await https.put<updateStaffRes, updateStaffReq>('/staff/update', req)

        return data.value
      }
      catch (error) {
        console.error('更新失败：', error)
        throw error
      }
    },
    async uploadAvatar(req: uploadFileReq) {
      return await https.upload<uploadFileRes, uploadFileReq>('/upload/avatar', req)
    },

  },

})
