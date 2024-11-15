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
        }
      }
      catch (error) {
        console.error('获取用户信息报错：', error)
      }

      return true
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
