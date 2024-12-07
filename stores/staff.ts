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
  },

})
