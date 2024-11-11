export const useAuth = defineStore('authStore', {
  state: () => ({
    token: '' as string,
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
      const { data } = await https.get<ImageCaptcha>('/get_captcha_image')
      this.imageCaptcha = data.value.data
    },

  },
  persist: true,

})
