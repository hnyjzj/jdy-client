export const useUser = defineStore('userStore', {
  state: () => ({
    userinfo: {} as UserInfo,
  }),
  getters: {

  },
  actions: {
    async getUserInfo() {
      try {
        const { data } = await https.get<UserInfo, null>('/user/info', null, true)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.userinfo = data.value.data
          return data.value.data
        }
        return false
      }
      catch (error) {
        console.error('获取用户信息报错：', error)
        throw error
      }
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },

})
