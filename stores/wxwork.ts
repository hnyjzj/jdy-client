import { defineStore } from 'pinia'

export const useWxworkStore = defineStore('Wxwork', {
  state: () => ({
    tickets: {} as ticketRes,
    wx: {} as undefined | WxWork,
  }),
  actions: {
    async useWxWork() {
      if (!this.tickets.corp_id) {
        const res = await this.getTickets({ platform: 'wxwork' })
        if (!res) {
          return
        }
      }
      // 使用现有tickets创建wx对象
      this.wx = wxWork(this.tickets)
      // 检查jsapi权限
      await this.wx.checkJsApi()
      // 返回wx对象
      return this.wx
    },
    async getTickets(req: ticketReq) {
      const { data } = await https.post<ticketRes, ticketReq>('/platform/jssdk', req, false)
      if (data.value?.code === HttpCode.SUCCESS) {
        this.tickets = data.value.data
        return data.value.data
      }
    },
    // 截屏警告功能
    async UserScreenWarning() {
      if (this.wx) {
        await this.useWxWork()
      }
      if (!this.wx?.UserCaptureScreen) {
        return
      }
      this.wx.UserCaptureScreen(async () => {
        const params = ref<{ username: string, storename?: string | undefined, url: string, title: string }>({
          username: '',
          storename: '',
          url: '',
          title: '',
        })
        // 判断是否登录
        const store = useAuth()
        if (Date.now() > (store.expires_at) * 1000) {
          return false
        }
        const { userinfo } = storeToRefs(useUser())
        const { UserScreen } = useUser()
        params.value.username = userinfo.value.nickname
        // 判断是否有门店
        const stores = useStores()
        if (stores.myStore.name) {
          params.value.storename = stores.myStore.name
        }
        else {
          params.value.storename = undefined
        }
        params.value.url = window.location.href
        params.value.title = document?.title || '其他'
        await UserScreen(params.value)
      })
    },
  },

})
