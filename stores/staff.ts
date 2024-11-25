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
        const { data } = await https.post<UserInfo, addStaffReq>('/user/create', req, true)
        if (data.value?.code === HttpCode.SUCCESS) {
        //   console.log(data.value)
        }
      }
      catch (error) {
        console.error('创建失败：', error)
      }

      return true
    },
  },

})
