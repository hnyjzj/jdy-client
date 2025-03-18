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
      if (!this.tickets.corp_id) {
        await this.getTickets({ platform: 'wxwork', type: 'agent' })
      }
      const wx = wxWork(this.tickets)
      await wx.checkJsApi()

      return wx
    },
    async getTickets(req: ticketReq) {
      const { data } = await https.post<ticketRes, ticketReq>('/platform/jssdk', req)

      if (data?.value?.code === HttpCode.SUCCESS) {
        this.tickets = data.value.data
      }
    },
  },

})
