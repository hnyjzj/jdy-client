export const useAuth = defineStore('authStore', {
  state: () => ({
    token: '' as string,
    expires_at: 0 as number,
    imageCaptcha: {
      id: '',
      code: '',
    } as ImageCaptcha,

  }),
  getters: {

  },
  actions: {
    /**
     * 授权登录
     */
    async OAuthLogin(req: OAuthReq) {
      const { data } = await https.post<OAuthRes, OAuthReq>('/oauth', req)
      if (data.value?.code === HttpCode.SUCCESS) {
        return data.value.data.redirect_url
      }
      return false
    },
    /**
     * 企业微信登录获取用户信息
     */
    async wxworkLogin(req: OAuthLoginReq) {
      const { data } = await https.post<Users, OAuthLoginReq>('/login/oauth', req)

      if (data.value?.code === HttpCode.SUCCESS) {
        const userStore = useUser()
        userStore.userinfo = data.value.data.res
        this.token = data.value.data.token
        return data.value.data
      }
      return false
    },

    /**
     * 获取验证码
     */
    async getCodeImg() {
      const { data } = await https.get<ImageCaptcha, null>('/get_captcha_image')
      if (data.value?.code === HttpCode.SUCCESS) {
        this.imageCaptcha = data.value.data
      }
      return false
    },

    /**
     *  账号登录
     */
    async accountLogin(req: Account) {
      const { data } = await https.post<any, Account>('/login/', req)
      const { $toast } = useNuxtApp()
      if (data.value?.code === HttpCode.SUCCESS) {
        // 登录成功 存储token ,跳转首页
        this.token = data.value.data.token
        this.expires_at = data.value.data.expires_at
        $toast({ msg: '登录成功', type: 'success', ico: 'i-icon:success' })
        navigateTo('/')
      }
      else if (data.value?.code === HttpCode.ERROR) {
        // 登录失败  ， 提示错误
        $toast({ msg: data.value.message, type: 'error', ico: 'i-icon:error' })
      }
    },

  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
    pick: ['token', 'expires_at'],
  },

})
