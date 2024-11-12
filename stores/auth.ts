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
    async OAuthLogin(redirect_url: string = '') {
      try {
        const uri = UrlAndParams(`${import.meta.env.VITE_BASE_URL || ''}/login/oauth`, {
          redirect_url: redirect_url || undefined,
        })

        const { data } = await https.post<OAuthRes, OAuthReq>('/oauth', { uri, state: 'wxwork' })
        if (data.value?.code === HttpCode.SUCCESS) {
          window.location.href = data.value.data.redirect_url
        }
        return false
      }
      catch (error) {
        console.error('授权登录错误：', error)
        throw error
      }
    },
    /**
     * 企业微信登录获取用户信息
     */
    async wxworkLogin(req: OAuthLoginReq) {
      try {
        const { data } = await https.post<WXworkLoginRes, OAuthLoginReq>('/login/oauth', req)

        if (data.value?.code === HttpCode.SUCCESS) {
          this.token = data.value.data.token
          this.expires_at = data.value.data.expires_at
        }
        return data.value.code
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
        const { data } = await https.get<ImageCaptcha, null>('/get_captcha_image')
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
    async accountLogin(req: Account) {
      try {
        const { data } = await https.post<any, Account>('/login/', req)
        const { $toast } = useNuxtApp()
        // 获取当前地址栏的参数 并抓换回去
        const route = useRoute()
        const redirect_url = route.query.redirect_url || '/'
        if (data.value?.code === HttpCode.SUCCESS) {
          // 登录成功 存储token ,跳转首页
          this.token = data.value.data.token
          this.expires_at = data.value.data.expires_at
          $toast({ msg: '登录成功', type: 'success', ico: 'i-icon:success' })
          navigateTo(decodeURIComponent(redirect_url as string))
        }
        else if (data.value?.code === HttpCode.ERROR) {
          // 登录失败  ， 提示错误
          $toast({ msg: data.value.message, type: 'error', ico: 'i-icon:error' })
        }
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
