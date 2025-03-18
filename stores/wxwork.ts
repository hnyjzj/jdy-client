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
      if (!this.tickets.jsapi) {
        await this.getTickets({ platform: 'wxwork', type: 'jsapi' })
      }
      if (!this.tickets.agent) {
        await this.getTickets({ platform: 'wxwork', type: 'agent' })
      }
      const wx = wxWork({
        agent_ticket: this.tickets.agent,
        jsapi_ticket: this.tickets.ticket,
      })
      await wx.checkJsApi()

      return wx
    },
    async getTickets(req: ticketReq) {
      const { data } = await https.post<ticketRes, ticketReq>('/platform/jssdk', req)

      if (data.value.code === HttpCode.SUCCESS) {
        const ticket = data.value.data.ticket
        if (req.type === 'jsapi') {
          this.tickets.jsapi = ticket
        }
        else {
          this.tickets.agent = ticket
        }
      }
    },
  },

})
