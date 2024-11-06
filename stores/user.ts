export const useUser = defineStore('userStore', {
  state: () => ({
    userinfo: {
      token: '',
      username: '',
    },
  }),
  getters: {

  },
  actions: {
    async increment() {
    //   const res = await https.post<Users>('/submit', { username: 'test' })
      //   const { data } = res
      //   setTimeout(() => {
      //     refresh()
      //     execute()
      //   }, 3000)

      //   watchEffect(() => {
      //     this.num = data.value
      //   })

    //   return res
    },

    async mockLogin() {
      // 模拟登录
      // 随机生成一个token
      const res = await https.post<Users>('/auth/login', { phone: 'test', password: '123123' })

      if (import.meta.client) {
        this.userinfo = res.data.value.data
      }

      return res.data.value.code === HttpCode.SUCCESS
    },

  },
  persist: true,

})
