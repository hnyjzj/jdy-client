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
  },

})
