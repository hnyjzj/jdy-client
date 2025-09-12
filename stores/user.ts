export const useUser = defineStore('userStore', {
  state: () => ({
    userinfo: {} as UserInfo,
  }),
  getters: {

  },
  actions: {
    async getUserInfo() {
      try {
        const { data } = await https.get<UserInfo, null>('/staff/my', null)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.userinfo = data.value.data
        }
      }
      catch (error) {
        console.error('获取用户信息报错：', error)
      }

      return true
    },
    async UserScreen(params: { username: string, storename?: string | undefined, url: string }) {
      await https.post<any, { username: string, storename?: string | undefined, url: string }>('/log/on_capture_screen', params, false, false)
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
  },
})
