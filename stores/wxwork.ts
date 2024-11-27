import { defineStore } from 'pinia'

export const useWxworkStore = defineStore('Wxwork', {
  state: () => ({
    tickets: {} as ticketRes,
  }),
  actions: {
    async useWxWork() {
      if (!isWxWorkClient() && !isWeChatClient()) {
        return
      }
      if (!this.tickets.agent && !this.tickets.jsapi) {
        await this.getTickets({ platform: 'wxwork', type: 'jsapi' })
      }
      const wx = wxWork({
        // agent_ticket: this.tickets.agent,
        jsapi_ticket: this.tickets.ticket,
      })
      await wx.checkJsApi()
      return wx
    },
    async getTickets(req: ticketReq) {
      const { data } = await https.post<ticketRes, ticketReq>('/platform/jssdk', req)

      if (data.value.code === HttpCode.SUCCESS) {
        this.tickets = data.value.data
      }
    },
  },

})
