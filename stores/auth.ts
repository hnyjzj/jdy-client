export const useAuth = defineStore('authStore', {
  state: () => ({
    token: '' as string,
    expires_at: 0 as number,
    redirect: '' as string | undefined,
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
    async getOauthUri(redirect_url: string = '', now_url = '/login/oauth') {
      try {
        const location = useBrowserLocation()
        // 获取当前地址栏的参数 并抓换回去
        const uri = UrlAndParams(`${location.value?.origin || ''}${now_url}`, {
          redirect_url: redirect_url || undefined,
        })
        // 获取授权地址
        const { data } = await https.post<OAuthRes, OAuthReq>('/platform/oauth', { uri, platform: 'wxwork' }, false)
        if (data.value?.code === HttpCode.SUCCESS) {
          this.redirect = data.value.data.redirect_url
          navigateTo(data.value.data.redirect_url, { external: true, replace: true, redirectCode: 200 })
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
        const res = await https.post<WXworkLoginRes, WXworkLoginReq>('/auth/oauth', req, false)
        const userStore = useUser()
        if (res.data.value?.code === HttpCode.SUCCESS) {
          this.token = res.data.value.data.token
          this.expires_at = res.data.value.data.expires_at
          await userStore.getUserInfo()
        }
        else {
          // 如果登录不成功给，则删掉存储的授权地址，防止反复请求死循环
          this.redirect = undefined
        }
        return res
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
        const { data } = await https.get<ImageCaptcha, null>('/captcha/image', null, false)
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
        const { data } = await https.post<AccountRes, AccountReq>('/auth/login', req, false)
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
    // 退出登录
    async exit() {
      try {
        const { data } = await https.post('/auth/logout', null)
        if (data.value?.code === HttpCode.SUCCESS) {
          await navigateTo('/login', { replace: true, redirectCode: 200 })
        }
        return true
      }
      catch (error) {
        console.error('退出登录错误:', error)
        throw error
      }
    },

  },
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
    pick: ['token', 'expires_at', 'redirect'],
  },

})
