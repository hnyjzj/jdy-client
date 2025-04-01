interface ticketRes {
  agent?: string
  jsapi?: string
  ticket: string

}
interface ticketReq {
  platform: 'wxwork'
  type: 'jsapi' | 'agent'
}
