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
     * 获取授权地址
     */
    async getOauthUri(redirect_url: string = '') {
      try {
        // 获取当前地址栏的参数 并抓换回去
        const uri = UrlAndParams(`${import.meta.env.VITE_BASE_URL || ''}/login/oauth`, {
          redirect_url: redirect_url || undefined,
        })
        // 获取授权地址
        const { data } = await https.post<OAuthRes, OAuthReq>('/platform/oauth', { uri, platform: 'wxwork' })
        if (data.value?.code === HttpCode.SUCCESS) {
          window.location.href = data.value.data.redirect_url
        }

        return data.value
      }
      catch (error) {
        console.error('授权登录错误：', error)
        throw error
      }
    },
    /**
     * 企业微信登录获取用户信息
     */
    async wxworkLogin(req: WXworkLoginReq) {
      try {
        const { data } = await https.post<WXworkLoginRes, WXworkLoginReq>('/auth/oauth', req)
        const userStore = useUser()
        if (data.value?.code === HttpCode.SUCCESS) {
          this.token = data.value.data.token
          this.expires_at = data.value.data.expires_at
          await userStore.getUserInfo()
        }
        return data.value
      }
      catch (error) {
        console.error('企业微信登录出错:', error)
        throw error
      }
    },

    /**
     * 获取验证码
     */
    async getCodeImg() {
      try {
        const { data } = await https.get<ImageCaptcha, null>('/captcha/image')
        if (data.value?.code === HttpCode.SUCCESS) {
          this.imageCaptcha = data.value.data
        }
        return false
      }
      catch (error) {
        console.error('登录出错：', error)
        throw error
      }
    },

    /**
     *  账号登录
     */
    async accountLogin(req: AccountReq) {
      try {
        const { data } = await https.post<AccountRes, AccountReq>('/auth/login', req)
        // 获取当前地址栏的参数 并抓换回去
        const userStore = useUser()
        const route = useRoute()
        const redirect_url = route.query.redirect_url || '/'
        if (data.value?.code === HttpCode.SUCCESS) {
          // 登录成功 存储token ,跳转首页
          this.token = data.value.data.token
          this.expires_at = data.value.data.expires_at
          this.imageCaptcha.id = ''
          this.imageCaptcha.code = ''
          await userStore.getUserInfo()
          await navigateTo(decodeURIComponent(redirect_url as string), { replace: true, redirectCode: 200 })
        }
        return data.value
      }
      catch (error) {
        console.error('账号登录错误:', error)
        throw error
      }
    },

  },
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
    pick: ['token', 'expires_at'],
  },

})
